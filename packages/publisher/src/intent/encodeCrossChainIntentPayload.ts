import type { MedusaCrossChainIntent } from "@intents-sdk/utils";
import { CROSS_CHAIN_INTENT_PARAM } from "@intents-sdk/utils";
import { encodeAbiParameters, keccak256, toBytes } from "viem";

const CROSS_CHAIN_INTENT_TYPE_STRING =
  "CrossChainIntent(address author,uint256 validBefore,uint256 nonce,address srcMToken,uint256 srcAmount,uint32 destinationChainId,uint256 nativeOutcome,address outcomeToken,uint256 outcomeAmount)";
const CROSS_CHAIN_INTENT_TYPE_HASH = keccak256(toBytes(CROSS_CHAIN_INTENT_TYPE_STRING));

export function encodeCrossChainIntentPayload(intent: MedusaCrossChainIntent) {
  const binaryIntent = {
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
  return encodeAbiParameters(
    [{ name: "payloadType", type: "bytes32" }, CROSS_CHAIN_INTENT_PARAM],
    [CROSS_CHAIN_INTENT_TYPE_HASH, binaryIntent],
  );
}
