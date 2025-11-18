import { type Address, type Hex, type UserConfig, writeContract } from "@intents-sdk/utils";
import { getCrossChainIntentBookContractAddress, CROSS_CHAIN_INTENT_BOOK_ABI } from "@intents-sdk/utils";

/**
 * Cancels a cross-chain intent by calling the cancel function on the CrossChainIntentBook contract.
 *
 * The intent must be in an Open state and cancellable according to the fulfillment verifier.
 * The verifier checks if the intent has expired (timestamp > validBefore) and has no filler.
 *
 * @param config - Partial user config including adapter, chainId, and contract information.
 * @param intentId - The cross-chain intent ID to cancel.
 * @param options - Optional cancellation options.
 * @param options.proof - Optional proof bytes for cancellation verification (defaults to empty bytes).
 * @returns A Promise that resolves to the transaction hash.
 *
 * @example
 * ```ts
 * const intentId = computeCrossChainIntentId(intent);
 * const txHash = await cancelCrossChainIntent(config, intentId);
 * await waitForTransactionReceiptWithChainId(config, chainId, txHash);
 * ```
 */
export async function cancelCrossChainIntent(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract" | "chains">,
  intentId: Address,
  options?: {
    proof?: Hex;
  },
): Promise<Hex> {
  const crossChainIntentBookAddress = getCrossChainIntentBookContractAddress(config);
  const proof = options?.proof ?? ("0x" as Hex);

  const txHash = await writeContract(config, crossChainIntentBookAddress, {
    chainId: config.chainId,
    abi: CROSS_CHAIN_INTENT_BOOK_ABI,
    functionName: "cancel",
    args: proof === "0x" ? [intentId] : [intentId, proof],
  });

  return txHash as Hex;
}
