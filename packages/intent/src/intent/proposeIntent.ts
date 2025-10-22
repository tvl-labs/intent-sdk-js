import type { Hex, UserConfig } from "@arcadia-network/utils";
import type { MedusaIntent } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";

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
