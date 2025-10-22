import type { UserConfig } from "@arcadia-network/utils";
import type { MedusaIntent } from "@arcadia-network/utils";
import { getAssetReservesContractAddress } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";
import { convertMedusaIntent } from "@arcadia-network/utils";
import { ASSET_RESERVES_ABI } from "@arcadia-network/utils";
import { parseUnits } from "@arcadia-network/utils";
import { ChainNotFoundError, getSourceTokenByMToken, toHex } from "@arcadia-network/utils";

export async function depositERC20WithIntent(
  config: Pick<UserConfig, "chains" | "adapter" | "chainId" | "contract" | "medusaURL">,
  amount: bigint,
  intent: MedusaIntent,
  options?: {
    payableValue?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
  },
) {
  const spoke = getSourceTokenByMToken(config, intent.srcMToken);
  const chain = config.chains.find((x) => x.chainId === toHex(spoke.chainId));
  if (!chain) throw new ChainNotFoundError();
  const payableValue = options?.payableValue ?? parseUnits("0.0004", chain.nativeCurrency.decimals);
  const assetReservesContractAddress = getAssetReservesContractAddress(config, spoke.chainId);
  const strIntent = convertMedusaIntent(intent);
  const txHash = await config.adapter.contractCaller.write({
    address: assetReservesContractAddress,
    abi: ASSET_RESERVES_ABI,
    args: [spoke.address, amount, strIntent],
    functionName: "depositERC20WithIntent",
    chainId: spoke.chainId,
    options: {
      value: payableValue,
      gas: options?.gas,
      gasPrice: options?.gasPrice,
    },
  });
  const medusaProvider = getMedusaProvider(config);
  const intentId = await medusaProvider.computeIntentId(intent);
  return { txHash, intentId };
}
