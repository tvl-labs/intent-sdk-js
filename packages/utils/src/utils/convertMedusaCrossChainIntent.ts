import type { Address, MedusaCrossChainIntent } from "../types";

/**
 * Converts a MedusaCrossChainIntent (with Hex string values for uint256 fields)
 * to the format expected by smart contracts (with bigint values for uint256 fields).
 *
 * @param intent - The MedusaCrossChainIntent object to convert.
 * @returns A new object with uint256 fields converted from Hex strings to bigint values.
 *
 * @example
 * ```ts
 * const contractIntent = convertMedusaCrossChainIntent(intent);
 * await writeContract(config, address, {
 *   chainId: chainId,
 *   abi: [...],
 *   functionName: "fill",
 *   args: [contractIntent, filler],
 * });
 * ```
 */
export function convertMedusaCrossChainIntent(intent: MedusaCrossChainIntent): {
  author: `0x${string}`;
  validBefore: bigint;
  nonce: bigint;
  srcMToken: `0x${string}`;
  srcAmount: bigint;
  destinationChainId: number;
  nativeOutcome: bigint;
  outcomeToken: `0x${string}`;
  outcomeAmount: bigint;
} {
  return {
    author: intent.author,
    validBefore: BigInt(intent.validBefore),
    nonce: BigInt(intent.nonce),
    srcMToken: intent.srcMToken,
    srcAmount: BigInt(intent.srcAmount),
    destinationChainId: intent.destinationChainId,
    nativeOutcome: BigInt(intent.nativeOutcome),
    outcomeToken: intent.outcomeToken,
    outcomeAmount: BigInt(intent.outcomeAmount),
  };
}
