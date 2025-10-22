import { InvalidIntentError, TimeoutError } from "./error";
import { delay } from "./delay";
import type { IntentState } from "../types/medusa";
import { getMedusaProvider } from "../medusa/getMedusaProvider";
import type { Hex, UserConfig } from "../types";
import { isInvalidIntent } from "./isInvalidIntent";

export async function waitForIntentStatus(
  config: Pick<UserConfig, "medusaURL">,
  intentId: Hex,
  finalState: IntentState,
  options?: {
    interval?: number;
    timeout?: number;
    ignoreInvalidIntent?: boolean;
  },
) {
  const interval = options?.interval ?? 2_000;
  const timeout = options?.timeout ?? 60_000;
  const ignoreInvalidIntent = options?.ignoreInvalidIntent ?? false;
  const provider = getMedusaProvider(config);
  const start = Date.now();
  while (true) {
    const state = await provider.getIntentStatus(intentId);
    if (!ignoreInvalidIntent && isInvalidIntent(state)) {
      throw new InvalidIntentError(state);
    }
    if (state === finalState) {
      return state;
    }
    if (Date.now() - start > timeout) {
      throw new TimeoutError("Timeout waiting for transaction receipt");
    }
    await delay(interval);
  }
}
