import { getMedusaProvider } from "../medusa";
import type { Hex, UserConfig } from "../types";
import { TimeoutError } from "./error";
import { delay } from "./delay";
import { isFullRefine } from "./isFullRefine";

export async function waitForQueryRefinement(
  config: Pick<UserConfig, "medusaURL">,
  intentId: Hex,
  options?: {
    interval?: number;
    timeout?: number;
  },
) {
  const interval = options?.interval ?? 2_000;
  const timeout = options?.timeout ?? 1_000 * 10;
  const provider = getMedusaProvider(config);
  const start = Date.now();
  while (true) {
    const queryRefinementResult = await provider.queryRefinement(intentId);
    if (isFullRefine(queryRefinementResult)) {
      return queryRefinementResult;
    }
    if (Date.now() - start > timeout) {
      throw new TimeoutError("Timeout waiting for query refinement");
    }
    await delay(interval);
  }
}
