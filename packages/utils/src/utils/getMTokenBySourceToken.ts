import type { UserConfig } from "../types";
import type { BaseToken } from "../types/token";
import { MTokenNotFoundError } from "./error";
import { isSameETHAddress } from "./isSameETHAddress";

export function getMTokenBySourceToken(config: Pick<UserConfig, "contract">, token: BaseToken) {
  const mToken = config.contract?.mTokens?.find(
    (m) => isSameETHAddress(m.spokeToken.address, token.address) && m.spokeToken.chainId === token.chainId,
  );
  if (!mToken) throw new MTokenNotFoundError();
  return mToken;
}
