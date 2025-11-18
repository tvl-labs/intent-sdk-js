import {
  type MedusaCrossChainIntent,
  type UserConfig,
  getCrossChainIntentBookContractAddress,
} from "@intents-sdk/utils";
import { signTypeDataV4 } from "@intents-sdk/utils";

/**
 * Signs a `MedusaCrossChainIntent` using EIP-712 structured data signing (eth_signTypedData_v4).
 *
 * @returns The signature of the signed intent.
 *
 * @example
 * ```ts
 * const signature = await signCrossChainIntent(config, intent);
 * await publishCrossChainIntent(config, intent, signature);
 * ```
 */
export async function signCrossChainIntent(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract">,
  intent: MedusaCrossChainIntent,
) {
  const typedData = {
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
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
    },
    domain: {
      name: "KhalaniIntent",
      version: "1.0.0",
      chainId: config.chainId,
      verifyingContract: getCrossChainIntentBookContractAddress(config),
    },
    primaryType: "CrossChainIntent",
    message: intent,
  };
  return signTypeDataV4(config, intent.author, typedData);
}
