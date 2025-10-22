import type { Address, UserConfig } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";

export async function computeVaultSharesForDeposit(
  config: Pick<UserConfig, "medusaURL">,
  tellerAddress: Address,
  mTokenToDeposit: Address,
  amount: bigint,
) {
  const provider = getMedusaProvider(config);
  const hexShares = await provider.previewDepositToVault(tellerAddress, mTokenToDeposit, amount.toString());
  return BigInt(hexShares);
}
