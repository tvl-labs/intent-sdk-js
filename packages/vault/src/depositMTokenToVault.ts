import type { Hex, UserConfig, Address } from "@arcadia-network/utils";
import { requestAccounts, getMedusaProvider } from "@arcadia-network/utils";
import { buildDepositMTokenToVaultPayload } from "./buildDepositMTokenToVaultPayload";

export async function depositMTokenToVault(
  config: Pick<UserConfig, "medusaURL" | "chainId" | "adapter">,
  vaultAddress: Address,
  mTokenAddress: Address,
  amount: bigint,
  minShares: bigint,
) {
  const [depositorAddress] = await requestAccounts(config);
  const { hexMessage, nonce, chainId } = buildDepositMTokenToVaultPayload(
    config,
    vaultAddress,
    depositorAddress,
    mTokenAddress,
    amount,
    minShares,
  );
  const signature = await config.adapter.request<Hex>({
    method: "personal_sign",
    params: [hexMessage, depositorAddress],
  });
  const provider = getMedusaProvider(config);
  return provider.depositToVault({
    payload: {
      chain_id: chainId,
      nonce: nonce.toString(),
      teller_address: vaultAddress,
      depositor_address: depositorAddress,
      asset: mTokenAddress,
      amount: amount.toString(),
      min_shares: minShares.toString(),
    },
    signature,
  });
}
