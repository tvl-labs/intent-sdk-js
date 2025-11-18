import type { MedusaIntent } from "@intents-sdk/utils";
import { FillStructureStringToEnum, INTENT_PARAM, OutcomeAssetStructureStringToEnum } from "@intents-sdk/utils";
import { encodeAbiParameters, keccak256, toBytes } from "viem";

const INTENT_TYPE_STRING =
  "Intent(address author,uint256 validBefore,uint256 validAfter,uint256 nonce,address srcMToken,uint256 srcAmount,Outcome outcome)Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)";
const INTENT_TYPE_HASH = keccak256(toBytes(INTENT_TYPE_STRING));

export function encodeIntentPayload(intent: MedusaIntent) {
  const binaryIntent = {
    author: intent.author,
    validBefore: BigInt(intent.validBefore),
    validAfter: BigInt(intent.validAfter),
    nonce: BigInt(intent.nonce),
    srcMToken: intent.srcMToken,
    srcAmount: BigInt(intent.srcAmount),
    outcome: {
      mTokens: intent.outcome.mTokens,
      mAmounts: intent.outcome.mAmounts.map((v) => BigInt(v)),
      outcomeAssetStructure: OutcomeAssetStructureStringToEnum[intent.outcome.outcomeAssetStructure],
      fillStructure: FillStructureStringToEnum[intent.outcome.fillStructure],
    },
  };
  return encodeAbiParameters(
    [{ name: "payloadType", type: "bytes32" }, INTENT_PARAM],
    [INTENT_TYPE_HASH, binaryIntent],
  );
}
