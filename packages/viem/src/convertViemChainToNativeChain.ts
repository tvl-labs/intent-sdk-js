// ...
import type { Chain as NativeChain } from "@intents-sdk/utils";
import { type Chain as ViemChain, toHex } from "viem";

export function convertViemChainToNativeChain(chain: ViemChain) {
  return {
    chainId: toHex(chain.id),
    chainName: chain.name,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: Object.values(chain.rpcUrls).flatMap((value) => value.http),
    blockExplorerUrls: [chain.blockExplorers?.default.url].filter((x) => x) as string[],
  } satisfies NativeChain;
}
