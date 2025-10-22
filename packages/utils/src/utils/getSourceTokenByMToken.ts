import type { Address, UserConfig } from "../types";
import { TokenNotFoundError } from "./error";
import { isSameETHAddress } from "./isSameETHAddress";

export function getSourceTokenByMToken(config: Pick<UserConfig, "contract">, mTokenAddress: Address) {
  const token = config.contract.mTokens?.find((token) => isSameETHAddress(token.address, mTokenAddress))?.spokeToken;
  if (!token) throw new TokenNotFoundError();
  return token;
}
