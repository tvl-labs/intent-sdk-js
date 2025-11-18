import type { BaseToken, Hex, UserConfig, Address } from "@intents-sdk/utils";
import { getAssetReservesContractAddress, ASSET_RESERVES_ABI, requestAccounts, readContract } from "@intents-sdk/utils";

export const DEFAULT_GAS_LIMIT = 250000n;

/**
 * Quote the relay deposit value for a given amount and optional payload/gas limit.
 */
export async function quoteRelayDeposit(
  config: Pick<UserConfig, "adapter" | "chains" | "contract">,
  spoke: BaseToken,
  amount: bigint,
  options?: {
    payload?: Hex;
    gasLimit?: bigint;
    depositor?: Address;
  },
): Promise<bigint> {
  const assetReservesContractAddress = getAssetReservesContractAddress(config, spoke.chainId);
  const depositor = options?.depositor ?? (await requestAccounts(config))[0];

  const result = await readContract(
    config,
    assetReservesContractAddress,
    spoke.chainId,
    {
      abi: ASSET_RESERVES_ABI,
      functionName: "quoteRelayDeposit",
      args: [spoke.address, depositor, amount, options?.payload ?? "0x", options?.gasLimit ?? DEFAULT_GAS_LIMIT],
    },
    {
      from: depositor,
    },
  );
  return BigInt(result);
}
