import type { UserConfig } from "../types";
import { getChainRPCURLFromConfig } from "./getChainRPCURL";
import { waitForTransactionReceipt } from "./waitForTransactionReceipt";

export function waitForTransactionReceiptWithChainId(
  config: Pick<UserConfig, "chains">,
  chainId: number,
  txHash: string,
  intervalMs?: number,
  timeoutMs?: number,
) {
  const rpcURL = getChainRPCURLFromConfig(config, chainId);
  return waitForTransactionReceipt(rpcURL, txHash, intervalMs, timeoutMs);
}
