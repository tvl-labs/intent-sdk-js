import { type UserConfig } from "@intents-sdk/utils";
import type { MedusaIntent } from "@intents-sdk/utils";
import { getSourceTokenByMToken } from "@intents-sdk/utils";
import { deposit } from "../mtoken";
import { encodeIntentPayload } from "./encodeIntentPayload";

export async function depositWithIntent(
  config: Pick<UserConfig, "chains" | "adapter" | "contract">,
  amount: bigint,
  intent: MedusaIntent,
  options?: {
    payableValue?: bigint;
    gasLimit?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
  },
) {
  const spoke = getSourceTokenByMToken(config, intent.srcMToken);
  const gasLimit = options?.gasLimit ?? 800000n;

  const payload = encodeIntentPayload(intent);
  return await deposit(config, spoke, amount, { ...options, payload, gasLimit });
}
