import type { Address, UserConfig } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";

export async function computeAssetForVaultWithdrawal(
  config: Pick<UserConfig, "medusaURL">,
  tellerAddress: Address,
  mTokenToGet: Address,
  sharesToBurn: bigint,
  feePercentage: number,
) {
  const feeBasisPoints = Math.floor(feePercentage * 10000);
  const provider = getMedusaProvider(config);
  const hexAmount = await provider.previewMaximumWithdrawFromVault(
    tellerAddress,
    mTokenToGet,
    sharesToBurn.toString(),
    feeBasisPoints,
  );
  return BigInt(hexAmount);
}
