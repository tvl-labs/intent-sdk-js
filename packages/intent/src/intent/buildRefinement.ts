import type { MedusaIntent, UserConfig } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";
import { waitForQueryRefinement } from "@arcadia-network/utils";

/**
 * Builds a refinement for a given `MedusaIntent` by querying the Medusa backend
 * to simulate and resolve the expected execution result of the intent.
 *
 * This function is typically used to **preview the outcome** of an intent before it is published,
 * allowing developers or users to inspect:
 * - What tokens would be received
 * - In what amounts
 * - Whether the outcome satisfies the fill and asset structure requirements
 *
 * This does **not** publish or execute the intent. It is a read-only operation powered by
 * the configured `medusaURL` backend, which resolves the current best-match route or liquidity path.
 *
 * @param config - SDK configuration containing Medusa backend URL.
 * @param intent - The intent object to refine. Must be a fully-formed `MedusaIntent`.
 *
 * @returns A Promise resolving to the full refinement object if successful, or `undefined` if the intent cannot yet be refined.
 *
 * @example
 * ```ts
 * const intent = await buildIntent({ ... });
 * const result = await buildRefinement(config, intent);
 * if (result) {
 *   console.log("Expected output:", result.Refinement);
 * } else {
 *   console.warn("Intent could not be refined (no route or insufficient liquidity)");
 * }
 * ```
 */
export async function buildRefinement(config: Pick<UserConfig, "medusaURL">, intent: MedusaIntent) {
  const medusaProvider = getMedusaProvider(config);
  const intentId = await medusaProvider.createRefinement(intent);
  return waitForQueryRefinement(config, intentId);
}
