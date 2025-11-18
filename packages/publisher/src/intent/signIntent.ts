import {
  type Address,
  FillStructureStringToEnum,
  type MedusaIntent,
  OutcomeAssetStructureStringToEnum,
  type UserConfig,
} from "@intents-sdk/utils";
import { signTypeDataV4 } from "@intents-sdk/utils";

/**
 * Signs a `MedusaIntent` using EIP-712 structured data signing (eth_signTypedData_v4).
 *
 * This function serializes the intent and its nested outcome structure into a typed data format,
 * allowing the resulting signature to be verified on-chain via EIP-712 domain separation.
 *
 * It is a crucial step before publishing the intent, especially when the smart contract
 * requires signature verification from the `author`.
 *
 * @param config - Partial user config including adapter and contract information.
 * @param address - The address of the signer (typically the same as `intent.author`).
 * @param intent - The full `MedusaIntent` object to be signed.
 * @param options - Optional behavior controls.
 *
 * @returns A Promise that resolves to the signature as a `Hex` string.
 *
 * @example
 * ```ts
 * const signature = await signIntent(config, userAddress, intent);
 * await proposeIntent(config, intent, signature);
 * ```
 *
 * @remarks
 * - Internally uses `eth_signTypedData_v4`, which is supported by most modern wallets.
 * - Converts `fillStructure` and `outcomeAssetStructure` enums to numeric (uint8) before signing.
 */
export async function signIntent(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract" | "experimental">,
  address: Address,
  intent: MedusaIntent,
) {
  const typeDataIntent = {
    ...intent,
    outcome: {
      ...intent.outcome,
      fillStructure: FillStructureStringToEnum[intent.outcome.fillStructure].toString(),
      outcomeAssetStructure: OutcomeAssetStructureStringToEnum[intent.outcome.outcomeAssetStructure].toString(),
    },
  };
  const typedData = {
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
      verifyingContract: config.contract.intentBook,
    },
    primaryType: "Intent",
    message: typeDataIntent,
  };
  return signTypeDataV4(config, address, typedData);
}
