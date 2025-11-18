import type { Address, UserConfig } from "@intents-sdk/utils";
import { TimeoutError, delay, IntentState } from "@intents-sdk/utils";
import { getCrossChainIntentState } from "./getCrossChainIntentState";

/**
 * Waits for a cross-chain intent to reach a specific state by polling the contract.
 *
 * @param config - Partial user config including adapter, chainId, and contract information.
 * @param intentId - The cross-chain intent ID to wait for.
 * @param finalState - The desired IntentState to wait for.
 * @param options - Optional configuration for polling interval and timeout.
 * @returns A Promise that resolves to the final IntentState when reached.
 *
 * @example
 * ```ts
 * await waitForCrossChainIntentState(config, intentId, IntentState.Solved);
 * ```
 */
export async function waitForCrossChainIntentState(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract">,
  intentId: Address,
  finalState: IntentState,
  options?: {
    interval?: number;
    timeout?: number;
  },
) {
  const interval = options?.interval ?? 2_000;
  const timeout = options?.timeout ?? 60_000;
  const start = Date.now();
  while (true) {
    const state = await getCrossChainIntentState(config, intentId);

    if (state === finalState) {
      return state;
    }

    if (Date.now() - start > timeout) {
      throw new TimeoutError("Timeout waiting for cross-chain intent state");
    }

    await delay(interval);
  }
}
