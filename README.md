# Khalani Intents JavaScript SDK

A comprehensive JavaScript SDK for interacting with Khalani intents, providing seamless cross-chain token swaps and intent-driven trading capabilities.

## Installation

Install the primary SDK package:

```bash
npm i @intents-sdk/publisher
```

Optional adapters:

```bash
# Viem Adapter
npm i @intents-sdk/viem-adapter

# Wagmi Adapter
npm i @intents-sdk/wagmi-adapter
```

## Configure UserConfig

Use `defineConfig` from `@intents-sdk/utils` to set up your runtime configuration:

```ts
import { defineConfig } from "@intents-sdk/utils";

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
  medusaURL: "please contact our team for this URL",
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
import { convertViemChainToNativeChain, ViemWalletAdapter } from "@intents-sdk/viem-adapter";
import { mainnet } from "viem/chains";

const chains = [mainnet];

const config = defineConfig({
  adapter: new ViemWalletAdapter(provider, chains),
  chains: chains.map((c) => convertViemChainToNativeChain(c)),
});
```

## Packages

- `@intents-sdk/publisher` — Core client for building and executing intents, token deposit/withdraw, and cross-chain flows.
- `@intents-sdk/utils` — Shared types, utilities, ABIs, Medusa helpers, and configuration (`defineConfig`).
- `@intents-sdk/viem-adapter` — Wallet adapter for viem providers.
- `@intents-sdk/wagmi-adapter` — Wallet adapter and utilities for wagmi.

## Concepts

### Config

All core actions such as swaps, deposit, and withdraw depend on a centralized configuration object called `UserConfig`. This configuration defines runtime environment, chain settings, contract addresses, and other essential parameters.

- The SDK does not ship with built-in chain or contract information.
- All supported chains, contract addresses, and token definitions must be explicitly set in your `defineConfig` call.

### Adapter

The `WalletAdapter` wraps an EIP-1193 provider and adds smart contract interaction capabilities via the `ContractCaller` interface.

- The SDK does not store or manage any private keys.
- You must provide a `WalletAdapter` (e.g., viem adapter) to handle signing securely.

### Intent

An intent is a predicate expression over future settlement transactions: a statement that encodes invariants about state transitions while remaining agnostic about how those transitions are achieved.

- Learn more: https://khalani.gitbook.io/khalani-docs/concepts/intents-and-solvers#id-1.-what-is-an-intent

### MToken

MTokens are unified accounting units over tokens on any blockchain to enable cross-chain functionality. MToken decimals are 18, even if the source token uses fewer decimals (e.g., USDT has 6).

### chainId vs chains[]

- `chainId` (number): Arcadia Chain ID for coordinating cross-chain operations.
- `chains[]` (array): List of chain definitions your application supports, including RPC URLs, native currency details, and names. The SDK uses this to route requests to the correct network.

## Example

Refine a cross-chain bridge intent using the intent SDK and common utils:

```ts
import { refineBridgeSwapIntent } from "@intents-sdk/publisher";
import { parseUnits, requestAccounts } from "@intents-sdk/utils";

const mainnetUSDC = { chainId: 1, address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" };
const arbUSDC = { chainId: 42161, address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" };

const amount = parseUnits("1", 6);
const [address] = await requestAccounts(config);

const { Refinement: bridgeIntent } = await refineBridgeSwapIntent(config, address, mainnetUSDC, arbUSDC, amount);
```

### Deposit with Intents (Recommended)

Authorize AssetReserves once, then deposit with intent:

```ts
import { depositERC20WithIntent, ensureERC20AllowanceToAssetReserves } from "@intents-sdk/publisher";
import { MAX_UINT_256 } from "@intents-sdk/utils";

const [author] = await requestAccounts(config);
await ensureERC20AllowanceToAssetReserves(config, mainnetUSDC, MAX_UINT_256, author);
await depositERC20WithIntent(config, amount, bridgeIntent);
```

### Bridge with Permit2

Use Permit2 to deposit and publish the intent:

```ts
import { bridgeSwapGenerator } from "@intents-sdk/publisher";
import { consumeIterator } from "@intents-sdk/utils";

await consumeIterator(
  bridgeSwapGenerator(config, bridgeIntent, {
    deposit: { style: "permit2" }, // default is permit2
  }),
);
```

### Bridge with token approvals

Use the approval/deposit flow:

```ts
import { bridgeSwapGenerator } from "@intents-sdk/publisher";
import { consumeIterator } from "@intents-sdk/utils";

await consumeIterator(
  bridgeSwapGenerator(config, bridgeIntent, {
    deposit: { style: "traditional" },
  }),
);
```

### 1-shot Deposits

One-shot deposit generator:

```ts
import { depositMTokenGenerator } from "@intents-sdk/publisher";
import { consumeIterator } from "@intents-sdk/utils";

const amount = 1000n;
await consumeIterator(depositMTokenGenerator(config, mainnetUSDC, amount));
```

### Signature Based Deposits

Build EIP-712 typed data, sign, then deposit:

```ts
import {
  buildDepositERC20Permit2,
  depositERC20WithSignature,
  ensureERC20Permit2Approved,
} from "@intents-sdk/publisher";
import { signTypeDataV4, requestAccounts } from "@intents-sdk/utils";

const [author] = await requestAccounts(config);
const amount = 1000n;

await ensureERC20Permit2Approved(config, mainnetUSDC, author);

const permit2 = buildDepositERC20Permit2(config, mainnetUSDC, amount, author);
const signature = await signTypeDataV4(config, permit2.depositor, permit2.typedData);
await depositERC20WithSignature(config, mainnetUSDC, amount, permit2, signature);
```

### Approval Based Deposits

Approve AssetReserves for an exact amount, then deposit:

```ts
import { depositERC20Traditional, ensureERC20AllowanceToAssetReserves } from "@intents-sdk/publisher";
import { requestAccounts } from "@intents-sdk/utils";

const [author] = await requestAccounts(config);
const amount = 1000n;

await ensureERC20AllowanceToAssetReserves(config, mainnetUSDC, amount, author);
await depositERC20Traditional(config, mainnetUSDC, amount);
```

### Approval Based Withdraws

Convert MToken back to the original token:

```ts
import { withdrawMToken } from "@intents-sdk/publisher";
import { getMTokenBySourceToken } from "@intents-sdk/utils";

const amount = 1000n;
const mTokenAddress = getMTokenBySourceToken(config, mainnetUSDC);
await withdrawMToken(config, mTokenAddress, amount);
```

### Error Handling

Common error types and handling patterns:

```ts
import { depositMTokenGenerator } from "@intents-sdk/publisher";
import { consumeIterator, AccountNotConnectedError, MTokenNotFoundError, TimeoutError } from "@intents-sdk/utils";

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
