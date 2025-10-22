import type { Address, UserConfig } from "@arcadia-network/utils";
import { bcs } from "@mysten/bcs";
import { randomU256BigInt, toBytes, toU256Bytes, toHex } from "@arcadia-network/utils";

const depositMTokenToVaultPayload = bcs.struct("DepositMTokenToVaultPayload", {
  depositor_address: bcs.vector(bcs.u8(), { length: 20 } as any),
  teller_address: bcs.vector(bcs.u8(), { length: 20 } as any),
  asset: bcs.vector(bcs.u8(), { length: 20 } as any),
  amount: bcs.vector(bcs.u8(), { length: 32 } as any),
  min_shares: bcs.vector(bcs.u8(), { length: 32 } as any),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
});

export function buildDepositMTokenToVaultPayload(
  config: Pick<UserConfig, "chainId" | "adapter">,
  vaultAddress: Address,
  depositorAddress: Address,
  mTokenAddress: Address,
  amount: bigint,
  minShares: bigint,
  options?: {
    nonce?: bigint;
  },
) {
  const nonce = options?.nonce ?? randomU256BigInt();
  const chainId = config.chainId;

  const depositorAddressBytes = toBytes(depositorAddress);
  const mTokenAddressBytes = toBytes(mTokenAddress);
  const vaultAddressBytes = toBytes(vaultAddress);
  const bcsPayload = depositMTokenToVaultPayload.serialize({
    depositor_address: depositorAddressBytes,
    teller_address: vaultAddressBytes,
    asset: mTokenAddressBytes,
    amount: toU256Bytes(amount),
    min_shares: toU256Bytes(minShares),
    nonce: toU256Bytes(nonce),
    chain_id: chainId,
  });
  const hexMessage = toHex(bcsPayload.toBytes());
  return {
    hexMessage,
    nonce,
    payload: bcsPayload,
    chainId,
  };
}
