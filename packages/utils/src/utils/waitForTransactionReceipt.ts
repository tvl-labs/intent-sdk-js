import { JSONRPCProvider } from "./JsonRPCProvider";
import { delay } from "./delay";

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  contractAddress: string | null;
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    logIndex: string;
    removed: boolean;
  }>;
  logsBloom: string;
  status?: "0x1" | "0x0";
  root?: string;
  from: string;
  to: string | null;
  effectiveGasPrice?: string;
  type?: string;
}

export async function waitForTransactionReceipt(
  rpcUrl: string,
  txHash: string,
  intervalMs = 3000,
  timeoutMs = 300_000,
): Promise<TransactionReceipt> {
  const start = Date.now();
  const provider = new JSONRPCProvider(rpcUrl);
  while (true) {
    const receipt = await provider.request<TransactionReceipt | null>({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    if (receipt && (receipt.status === "0x1" || receipt.status === "0x0")) {
      return receipt;
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error("Timeout waiting for transaction receipt");
    }
    await delay(intervalMs);
  }
}
