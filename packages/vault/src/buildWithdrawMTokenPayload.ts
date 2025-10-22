import { bcs } from "@mysten/bcs";
import { randomU256BigInt, toHex, toU256Bytes, toBytes } from "@arcadia-network/utils";
import type { Address, UserConfig } from "@arcadia-network/utils";

const withdrawMTokenFromVaultPayload = bcs.struct("WithdrawMTokenFromVaultPayload", {
  depositor_address: bcs.vector(bcs.u8(), { length: 20 } as any),
  teller_address: bcs.vector(bcs.u8(), { length: 20 } as any),
  asset: bcs.vector(bcs.u8(), { length: 20 } as any),
  shares: bcs.vector(bcs.u8(), { length: 32 } as any),
  min_amount: bcs.vector(bcs.u8(), { length: 32 } as any),
  fee_percentage: bcs.u16(),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
});

export function buildWithdrawMTokenPayload(
  config: Pick<UserConfig, "chainId">,
  tellerAddress: Address,
  sharesToBurn: bigint,
  depositorAddress: Address,
  mTokenAddress: Address,
  minAmount: bigint,
  feePercentage: number,
  options?: {
    nonce?: bigint;
  },
) {
  const chainId = config.chainId;
  const mTokenAddressBytes = toBytes(mTokenAddress);
  const tellerAddressBytes = toBytes(tellerAddress);
  const depositorAddressBytes = toBytes(depositorAddress);
  const feeBasisPoints = Math.floor(feePercentage * 10000);
  const nonce = options?.nonce ?? randomU256BigInt();
  const payload = withdrawMTokenFromVaultPayload.serialize({
    depositor_address: depositorAddressBytes,
    teller_address: tellerAddressBytes,
    asset: mTokenAddressBytes,
    shares: toU256Bytes(sharesToBurn),
    min_amount: toU256Bytes(minAmount),
    fee_percentage: feeBasisPoints,
    nonce: toU256Bytes(nonce),
    chain_id: chainId,
  });
  const hexMessage = toHex(payload.toBytes());
  return {
    hexMessage,
    nonce,
    payload,
    chainId,
  };
}
