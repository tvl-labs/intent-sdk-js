import type { Hex, UserConfig } from "@intents-sdk/utils";
import type { MedusaCrossChainIntent } from "@intents-sdk/utils";
import { getMedusaProvider } from "@intents-sdk/utils";

/**
 * Publishes a cross-chain intent to the Medusa backend for publication and propagation.
 *
 * @returns The transaction hash of the published intent.
 *
 * @example
 * ```ts
 * const signature = await signCrossChainIntent(config, intent);
 * const txHash = await publishCrossChainIntent(config, intent, signature);
 * ```
 */
export async function publishCrossChainIntent(
  config: Pick<UserConfig, "medusaURL">,
  intent: MedusaCrossChainIntent,
  signature: Hex,
) {
  const provider = getMedusaProvider(config);
  const txHash = await provider.publishCrossChainIntent(intent, signature);
  return txHash;
}
