import type { Hex, UserConfig, Address } from "@arcadia-network/utils";
import { getMedusaProvider, requestAccounts } from "@arcadia-network/utils";
import { buildWithdrawMTokenPayload } from "./buildWithdrawMTokenPayload";

export async function withdrawMTokenFromVault(
  config: Pick<UserConfig, "medusaURL" | "chainId" | "adapter">,
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
  const feeBasisPoints = Math.floor(feePercentage * 10000);
  const addresses = await requestAccounts(config);
  const [callerAddress] = addresses;

  const { hexMessage, chainId, nonce } = buildWithdrawMTokenPayload(
    config,
    tellerAddress,
    sharesToBurn,
    depositorAddress,
    mTokenAddress,
    minAmount,
    feePercentage,
    {
      nonce: options?.nonce,
    },
  );
  const signature = await config.adapter.request<Hex>({
    method: "personal_sign",
    params: [hexMessage, callerAddress],
  });

  const provider = getMedusaProvider(config);
  return provider.withdrawFromVault({
    payload: {
      chain_id: chainId,
      nonce: nonce.toString(),
      teller_address: tellerAddress,
      depositor_address: depositorAddress,
      shares: sharesToBurn.toString(),
      asset: mTokenAddress,
      min_amount: minAmount.toString(),
      fee_percentage: feeBasisPoints,
    },
    signature,
  });
}
