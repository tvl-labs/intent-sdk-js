import type { Address } from "./utils";

export interface BaseToken {
  chainId: number;
  address: Address;
}

export interface Token extends BaseToken {
  symbol: string;
  decimals: number;
}

export interface MToken extends Token {
  spokeToken: Token;
}
