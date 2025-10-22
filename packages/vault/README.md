# @arcadia-network/vault

Vault utilities for the Arcadia Network SDK.

## Overview

This package provides a convenient interface for interacting with Arcadia Network vaults. It re-exports vault functionality from the core SDK and provides TypeScript types for vault operations.

## Installation

```bash
npm install @arcadia-network/vault
```

## Usage

```typescript
import {
  depositMTokenToVault,
  withdrawMTokenFromVault,
  computeVaultSharesForDeposit,
  computeAssetForVaultWithdrawal,
} from "@arcadia-network/vault";

// Deposit mTokens to a vault
await depositMTokenToVault(config, vaultAddress, mTokenAddress, amount, minShares);

// Withdraw mTokens from a vault
await withdrawMTokenFromVault(
  config,
  tellerAddress,
  sharesToBurn,
  depositorAddress,
  mTokenAddress,
  minAmount,
  feePercentage,
);
```

## Features

- **Deposit Operations**: Deposit mTokens to vaults with minimum share guarantees
- **Withdrawal Operations**: Withdraw mTokens from vaults with fee calculations
- **Share Calculations**: Compute vault shares for deposits and asset amounts for withdrawals
- **Approval Management**: Handle mToken spending approvals for vault operations
- **Type Safety**: Full TypeScript support with exported types

## API Reference

### Functions

- `depositMTokenToVault()` - Deposit mTokens to a vault
- `withdrawMTokenFromVault()` - Withdraw mTokens from a vault
- `computeVaultSharesForDeposit()` - Calculate vault shares for a deposit amount
- `computeAssetForVaultWithdrawal()` - Calculate asset amount for vault withdrawal
- `approveMTokenSpendByVault()` - Approve mToken spending by vault
- `buildDepositMTokenToVaultPayload()` - Build deposit payload for signing
- `buildWithdrawMTokenPayload()` - Build withdrawal payload for signing

### Types

- `UserConfig` - SDK configuration interface
- `Address` - Ethereum address type
- `MToken` - mToken configuration interface
- `WalletAdapter` - Wallet adapter interface
- `VaultNotFoundError` - Vault not found error class
- `InvalidIntentError` - Invalid intent error class

## License

MIT
