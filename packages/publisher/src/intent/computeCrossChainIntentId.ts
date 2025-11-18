import type { Hex, MedusaCrossChainIntent } from "@intents-sdk/utils";
import { hashStruct } from "viem";

/**
 * Computes the cross-chain intent ID as the EIP-712 hashStruct of the cross-chain intent.
 *
 * @param intent - The MedusaCrossChainIntent object to compute the ID for.
 * @returns The cross-chain intent ID as a bytes32 hash.
 *
 * @example
 * ```ts
 * const intentId = computeCrossChainIntentId(intent);
 * ```
 */
export function computeCrossChainIntentId(intent: MedusaCrossChainIntent): Hex {
  return hashStruct({
    data: intent as unknown as Record<string, unknown>,
    primaryType: "CrossChainIntent",
    types: {
      CrossChainIntent: [
        { name: "author", type: "address" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "srcMToken", type: "address" },
        { name: "srcAmount", type: "uint256" },
        { name: "destinationChainId", type: "uint32" },
        { name: "nativeOutcome", type: "uint256" },
        { name: "outcomeToken", type: "address" },
        { name: "outcomeAmount", type: "uint256" },
      ],
    },
  });
}
