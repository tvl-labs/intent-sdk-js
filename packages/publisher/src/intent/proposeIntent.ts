import type { Hex, UserConfig } from "@intents-sdk/utils";
import type { MedusaIntent } from "@intents-sdk/utils";
import { getMedusaProvider } from "@intents-sdk/utils";

export async function proposeIntent(config: Pick<UserConfig, "medusaURL">, intent: MedusaIntent, signature: Hex) {
  const provider = getMedusaProvider(config);
  const [txHash, intentId] = await provider.proposeIntent({
    intent,
    signature,
  });
  return {
    txHash,
    intentId,
  };
}
