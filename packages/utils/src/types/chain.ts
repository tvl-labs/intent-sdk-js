import type { Hex } from "./utils";

export interface Chain {
  chainId: Hex;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export type HexChainId = Hex;
