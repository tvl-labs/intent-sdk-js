import { JSONRPCProvider } from "./JsonRPCProvider";
import type { EthProvider } from "../types/ethRPC";

/**
 * Creates an Ethereum RPC provider proxy instance.
 * The returned provider can be used to call standard Ethereum JSON-RPC methods
 * through a typed interface.
 *
 * @param rpcURL - The Ethereum RPC endpoint URL
 * @returns A typed Ethereum RPC provider proxy instance
 *
 * @example
 * ```ts
 * const provider = getEthRPC("https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY");
 * const balance = await provider.eth_getBalance("0x...", "latest");
 * const blockNumber = await provider.eth_blockNumber();
 * ```
 */
export function getEthRPC(rpcURL: string): EthProvider {
  return JSONRPCProvider.createProxy<EthProvider>(rpcURL);
}
