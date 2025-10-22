import type { Address, BaseToken, UserConfig } from "@intents-sdk/utils";
import { FillStructureStr, type MedusaIntent, OutcomeAssetStructureStr } from "@intents-sdk/utils";
import { getMTokenBySourceToken } from "@intents-sdk/utils";
import { getDeadline, randomU256BigInt } from "@intents-sdk/utils";
import { convertSourceTokenAmountToMTokenAmount } from "@intents-sdk/utils";

/**
 * Constructs a `MedusaIntent` object for a given source token, destination token set,
 * and desired swap structure. This function only builds the intent object in memory —
 * it does not publish or sign the intent.
 *
 * Use this function when you need to:
 * - Preview or inspect an intent before submitting it
 * - Customize the output structure or fill behavior
 * - Attach the intent to an off-chain workflow (e.g. relayer, batched submission)
 *
 * @param config - Partial SDK configuration including chain ID, contract instance, and adapter.
 * @param author - Address of the intent creator. This will be used in the `author` field of the intent.
 * @param sourceToken - The base token to be used in the swap or liquidity action.
 * @param destinationTokens - The set of tokens expected as the outcome of the intent.
 * @param amount - The amount of the source token to use (in base units).
 * @param fillStructure - Defines how the outcome should be fulfilled (e.g., Exact, Minimum, PercentageFilled).
 * @param options - Optional parameters to customize the intent behavior.
 * @param options.feePercentage - Optional fee percentage (e.g. `0.01` for 1%) to deduct from the source amount.
 * @param options.outcomeAssetStructure - Defines the expected structure of the outcome tokens (e.g., All, AnySingle, Any).
 * @param options.validBefore - UNIX timestamp (in seconds) after which the intent becomes invalid.
 * @param options.validAfter - (Optional) UNIX timestamp (in seconds) before which the intent is invalid.
 *
 * @returns A Promise that resolves to a fully constructed `MedusaIntent` object.
 *
 * @example
 * ```ts
 * const intent = buildIntent(
 *   config,
 *   userAddress,
 *   sourceToken,
 *   [destinationTokenA, destinationTokenB],
 *   parseUnits("100", 18),
 *   FillStructureStr.Minimum,
 *   { feePercentage: 0.005, outcomeAssetStructure: OutcomeAssetStructureStr.All }
 * )
 * ```
 */
export function buildIntent(
  config: Pick<UserConfig, "chainId" | "contract" | "adapter" | "experimental">,
  author: Address,
  sourceToken: BaseToken,
  destinationTokens: BaseToken[],
  amount: bigint,
  fillStructure: FillStructureStr,
  options?: {
    feePercentage?: number;
    outcomeAssetStructure?: OutcomeAssetStructureStr;
    validBefore?: string;
    validAfter?: string;
  },
): MedusaIntent {
  const feePercentage = options?.feePercentage;
  const nonce = randomU256BigInt();
  const srcMToken = getMTokenBySourceToken(config, sourceToken);
  const destMTokens = destinationTokens.map((x) => getMTokenBySourceToken(config, x));
  const mTokenAmount = convertSourceTokenAmountToMTokenAmount(config, sourceToken, amount);
  const mAmounts = feePercentage
    ? destMTokens.map(() => {
        const feeInBasisPoints = Math.floor(Number(feePercentage) * 1000);
        const scaledAmount = BigInt(feeInBasisPoints) * BigInt(10) ** BigInt(15);
        return scaledAmount.toString();
      })
    : [mTokenAmount.toString()];
  const timeRangFields = {
    ...(config.experimental?.enabledTTLField
      ? {
          ttl: options?.validBefore ?? getDeadline(),
        }
      : {}),
    ...(config.experimental?.enabledDeadlineField
      ? {
          deadline: options?.validBefore ?? getDeadline(),
        }
      : {}),
    ...(!config.experimental?.enabledTTLField && !config.experimental?.enabledDeadlineField
      ? {
          validBefore: options?.validBefore ?? getDeadline(),
          validAfter: options?.validAfter ?? "0",
        }
      : {}),
  };
  return {
    author: author,
    ...timeRangFields,
    nonce: nonce.toString(),
    srcMToken: srcMToken.address,
    srcAmount: mTokenAmount.toString(),
    outcome: {
      mAmounts,
      mTokens: destMTokens.map((x) => x.address),
      outcomeAssetStructure: options?.outcomeAssetStructure ?? OutcomeAssetStructureStr.AnySingle,
      fillStructure,
    },
  } as MedusaIntent;
}
