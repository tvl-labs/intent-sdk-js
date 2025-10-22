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
 * @param options.ignoreDomain - If true, skips including the EIP-712 domain. Useful for testing or off-chain flows. Default: false.
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
 * - If `ignoreDomain` is true, the resulting signature will not be domain-separated and may fail on-chain verification.
 */
export async function signIntent(
  config: Pick<UserConfig, "adapter" | "contract" | "experimental">,
  address: Address,
  intent: MedusaIntent,
  options?: {
    ignoreDomain?: boolean;
  },
) {
  const ignoreDomain = options?.ignoreDomain ?? config.experimental?.ignoreSignIntentDomain ?? false;
  const typeDataIntent = {
    ...intent,
    outcome: {
      ...intent.outcome,
      fillStructure: FillStructureStringToEnum[intent.outcome.fillStructure].toString(),
      outcomeAssetStructure: OutcomeAssetStructureStringToEnum[intent.outcome.outcomeAssetStructure].toString(),
    },
  };
  const timeRangFields = [
    ...(config.experimental?.enabledTTLField ? [{ name: "ttl", type: "uint256" }] : []),
    ...(config.experimental?.enabledDeadlineField ? [{ name: "deadline", type: "uint64" }] : []),
    ...(!config.experimental?.enabledTTLField && !config.experimental?.enabledDeadlineField
      ? [
          { name: "validBefore", type: "uint256" },
          { name: "validAfter", type: "uint256" },
        ]
      : []),
  ];
  const typedData = {
    types: {
      Intent: [
        { name: "author", type: "address" },
        ...timeRangFields,
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
      ...(!ignoreDomain
        ? {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "verifyingContract", type: "address" },
            ],
          }
        : {}),
    },
    domain: {
      name: "KhalaniIntent",
      version: "1.0.0",
      verifyingContract: config.contract.intentBook,
    },
    primaryType: "Intent",
    message: typeDataIntent,
  };
  return signTypeDataV4(config, address, typedData);
}
