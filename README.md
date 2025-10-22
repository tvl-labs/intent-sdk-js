# Arcadia JS SDK

A comprehensive JavaScript SDK for interacting with the Arcadia protocol, providing seamless cross-chain token bridging and intent-based trading capabilities.

## Installation

Install the primary SDK package:

```bash
npm i @arcadia-network/intent
```

Optional adapters:

```bash
# Viem Adapter
npm i @arcadia-network/viem-adapter

# Wagmi Adapter
npm i @arcadia-network/wagmi-adapter
```

## Configure UserConfig

Use `defineConfig` from `@arcadia-network/utils` to set up your runtime configuration:

```ts
import { defineConfig } from "@arcadia-network/utils";

defineConfig({
  adapter: walletAdapter, // Your wallet adapter
  chainId: 1,
  chains: [
    {
      chainId: "0x1",
      chainName: "Ethereum",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://eth.llamarpc.com"],
    },
  ],
  medusaURL: "https://medusa.arcadia.khalani.network",
  contract: {
    assetReserves: { "0x1": "0x..." },
    mTokens: [
      {
        chainId: 1,
        address: "0x...",
        symbol: "mUSDC",
        decimals: 18,
        spokeToken: { chainId: 1, address: "0xA0b8...", symbol: "USDC", decimals: 6 },
      },
    ],
    intentBook: "0x...",
  },
});
```

Adapter example (viem):

```ts
import { convertViemChainToNativeChain, ViemWalletAdapter } from "@arcadia-network/viem-adapter";
import { mainnet } from "viem/chains";

const chains = [mainnet];

defineConfig({
  adapter: new ViemWalletAdapter(provider, chains),
  chains: chains.map((c) => convertViemChainToNativeChain(c)),
});
```

## Packages

- `@arcadia-network/intent` — Core client for building and executing intents, MToken deposit/withdraw, and bridge flows.
- `@arcadia-network/utils` — Shared types, utilities, ABIs, Medusa helpers, and configuration (`defineConfig`).
- `@arcadia-network/vault` — Vault interactions and helpers.
- `@arcadia-network/viem-adapter` — Wallet adapter for viem providers.
- `@arcadia-network/wagmi-adapter` — Wallet adapter and utilities for wagmi.
- `@arcadia-network/react` — React hooks and components for integrating Arcadia in React apps.

## Concepts

### Config

All core actions—such as bridge, deposit, and withdraw—depend on a centralized configuration object called `UserConfig`. This configuration defines runtime environment, chain settings, contract addresses, and other essential parameters.

- The SDK does not ship with built-in chain or contract information.
- All supported chains, contract addresses, and token definitions must be explicitly set in your `defineConfig` call.

### Adapter

The `WalletAdapter` wraps an EIP-1193 provider and adds smart contract interaction capabilities via the `ContractCaller` interface.

- The SDK does not store or manage any private keys.
- You must provide a `WalletAdapter` (e.g., viem adapter) to handle signing securely.

### Intent

An intent is a result predicate expression for future settlement transactions: a statement that encodes invariants about state transitions while remaining agnostic about how those transitions are achieved.

- Learn more: https://khalani.gitbook.io/khalani-docs/concepts/intents-and-solvers#id-1.-what-is-an-intent

### MToken

MTokens are wrapped versions of traditional tokens that enable cross-chain functionality. They maintain a 1:1 relationship with underlying tokens.

- For cross-chain transactions or liquidity provisioning, deposits are converted to MToken first.
- MToken decimals are 18, even if the source token uses fewer decimals (e.g., USDT has 6).

### chainId vs chains[]

- `chainId` (number): Arcadia Hub ID for coordinating cross-chain operations.
- `chains[]` (array): List of chain definitions your application supports, including RPC URLs, native currency details, and names. The SDK uses this to route requests to the correct network.

## Example

Refine a bridge intent using the intent SDK and common utils:

```ts
import { refineBridgeSwapIntent } from "@arcadia-network/intent";
import { parseUnits, requestAccounts } from "@arcadia-network/utils";

const mainnetUSDC = { chainId: 1, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" };
const arbUSDC = { chainId: 42161, address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" };

const amount = parseUnits("1", 6);
const [address] = await requestAccounts(config);

const { Refinement: bridgeIntent } = await refineBridgeSwapIntent(config, address, mainnetUSDC, arbUSDC, amount);
```

### Deposit with Intent (Recommended)

Authorize AssetReserves once, then deposit with intent:

```ts
import { depositERC20WithIntent, ensureERC20AllowanceToAssetReserves } from "@arcadia-network/intent";
import { MAX_UINT_256 } from "@arcadia-network/utils";

const [author] = await requestAccounts(config);
await ensureERC20AllowanceToAssetReserves(config, mainnetUSDC, MAX_UINT_256, author);
await depositERC20WithIntent(config, amount, bridgeIntent);
```

### Bridge (Permit2 style)

Use Permit2 to deposit and publish the intent:

```ts
import { bridgeSwapGenerator } from "@arcadia-network/intent";
import { consumeIterator } from "@arcadia-network/utils";

await consumeIterator(
  bridgeSwapGenerator(config, bridgeIntent, {
    deposit: { style: "permit2" }, // default is permit2
  }),
);
```

### Bridge (Traditional style)

Use traditional approval/deposit flow:

```ts
import { bridgeSwapGenerator } from "@arcadia-network/intent";
import { consumeIterator } from "@arcadia-network/utils";

await consumeIterator(
  bridgeSwapGenerator(config, bridgeIntent, {
    deposit: { style: "traditional" },
  }),
);
```

### Deposit (Quick way)

One-shot deposit generator:

```ts
import { depositMTokenGenerator } from "@arcadia-network/intent";
import { consumeIterator } from "@arcadia-network/utils";

const amount = 1000n;
await consumeIterator(depositMTokenGenerator(config, mainnetUSDC, amount));
```

### Deposit (With signature, Permit2)

Build EIP-712 typed data, sign, then deposit:

```ts
import {
  buildDepositERC20Permit2,
  depositERC20WithSignature,
  ensureERC20Permit2Approved,
} from "@arcadia-network/intent";
import { signTypeDataV4, requestAccounts } from "@arcadia-network/utils";

const [author] = await requestAccounts(config);
const amount = 1000n;

await ensureERC20Permit2Approved(config, mainnetUSDC, author);

const permit2 = buildDepositERC20Permit2(config, mainnetUSDC, amount, author);
const signature = await signTypeDataV4(config, permit2.depositor, permit2.typedData);
await depositERC20WithSignature(config, mainnetUSDC, amount, permit2, signature);
```

### Deposit (Traditional)

Approve AssetReserves for an exact amount, then deposit:

```ts
import { depositERC20Traditional, ensureERC20AllowanceToAssetReserves } from "@arcadia-network/intent";
import { requestAccounts } from "@arcadia-network/utils";

const [author] = await requestAccounts(config);
const amount = 1000n;

await ensureERC20AllowanceToAssetReserves(config, mainnetUSDC, amount, author);
await depositERC20Traditional(config, mainnetUSDC, amount);
```

### Withdraw (Traditional)

Convert MToken back to the original token:

```ts
import { withdrawMToken } from "@arcadia-network/intent";
import { getMTokenBySourceToken } from "@arcadia-network/utils";

const amount = 1000n;
const mTokenAddress = getMTokenBySourceToken(config, mainnetUSDC);
await withdrawMToken(config, mTokenAddress, amount);
```

### Error Handling

Common error types and handling patterns:

```ts
import { depositMTokenGenerator } from "@arcadia-network/intent";
import { consumeIterator, AccountNotConnectedError, MTokenNotFoundError, TimeoutError } from "@arcadia-network/utils";

try {
  const amount = 1000n;
  const result = await consumeIterator(depositMTokenGenerator(config, mainnetUSDC, amount));
  console.log("Deposit successful:", result);
} catch (error) {
  if (error instanceof AccountNotConnectedError) {
    console.error("Please connect your wallet first");
  } else if (error instanceof MTokenNotFoundError) {
    console.error("MToken does not exist:", (error as Error).message);
  } else if (error instanceof TimeoutError) {
    console.error("Operation timed out:", (error as Error).message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## More Resources

- https://khalani.gitbook.io/khalani-docs/
- https://khalani.gitbook.io/khalani-docs/concepts/intents-and-solvers
