import type { Address, MedusaIntent } from "@intents-sdk/utils";
import { convertMedusaIntent } from "@intents-sdk/utils";
import { hashStruct } from "viem";

/**
 * Computes the intent ID as the EIP-712 hashStruct of the intent.
 *
 * @param intent - The MedusaIntent object to compute the ID for.
 * @returns The intent ID as a bytes32 hash (Address type).
 *
 * @example
 * ```ts
 * const intentId = computeIntentId(intent);
 * ```
 */
export function computeIntentId(intent: MedusaIntent): Address {
  return hashStruct({
    data: convertMedusaIntent(intent) as any,
    primaryType: "Intent",
    types: {
      Intent: [
        { name: "author", type: "address" },
        { name: "validBefore", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "srcMToken", type: "address" },
        { name: "srcAmount", type: "uint256" },
        { name: "outcome", type: "Outcome" },
      ],
      Outcome: [
        { name: "mTokens", type: "address[]" },
        { name: "mAmounts", type: "uint256[]" },
        { name: "outcomeAssetStructure", type: "uint8" },
        { name: "fillStructure", type: "uint8" },
      ],
    },
  });
}
