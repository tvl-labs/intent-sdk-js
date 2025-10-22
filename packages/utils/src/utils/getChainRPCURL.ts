import type { Chain, UserConfig } from "../types";
import { ChainNotFoundError, RpcURLNotFoundError } from "./error";
import { toHex } from "./toHex";

export function getChainRPCURL(chain: Chain) {
  const url = chain.rpcUrls[0];
  if (!url) throw new RpcURLNotFoundError();
  return url;
}

export function getChainRPCURLFromConfig(config: Pick<UserConfig, "chains">, chainId: number) {
  const chain = config.chains.find((chain) => chain.chainId === toHex(chainId));
  if (!chain) throw new ChainNotFoundError();
  return getChainRPCURL(chain);
}
