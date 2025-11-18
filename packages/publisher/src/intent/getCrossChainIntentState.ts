import type { Address, UserConfig } from "@intents-sdk/utils";
import {
  IntentState,
  getCrossChainIntentBookContractAddress,
  CROSS_CHAIN_INTENT_BOOK_ABI,
  readContract,
} from "@intents-sdk/utils";

/**
 * Maps contract IntentState enum (uint8) to IntentState string enum.
 * Based on contracts/src/types/Intent.sol:
 * enum IntentState { NonExistent, Open, Solved, Cancelled }
 */
const CONTRACT_STATE_TO_INTENT_STATE: Record<number, IntentState> = {
  0: IntentState.NonExistent,
  1: IntentState.Open,
  2: IntentState.Solved,
  3: IntentState.Cancelled,
};

/**
 * Retrieves the current execution state/status of a cross-chain intent from the contract.
 *
 * @param config - Partial user config including adapter, chainId, and contract information.
 * @param intentId - The cross-chain intent ID to check.
 * @returns A Promise that resolves to the IntentState enum value.
 *
 * @example
 * ```ts
 * const state = await getCrossChainIntentState(config, intentId);
 * ```
 */
export async function getCrossChainIntentState(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract" | "chains">,
  intentId: Address,
): Promise<IntentState> {
  const crossChainIntentBookAddress = getCrossChainIntentBookContractAddress(config);
  const contractState = await readContract(config, crossChainIntentBookAddress, config.chainId, {
    abi: CROSS_CHAIN_INTENT_BOOK_ABI,
    functionName: "intentStates",
    args: [intentId],
  });
  return CONTRACT_STATE_TO_INTENT_STATE[contractState];
}
