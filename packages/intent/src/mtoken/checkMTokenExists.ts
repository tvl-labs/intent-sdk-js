import type { UserConfig } from "@arcadia-network/utils";
import type { BaseToken } from "@arcadia-network/utils";
import { MTokenNotFoundError } from "@arcadia-network/utils";
import { isSameETHAddress } from "@arcadia-network/utils";

export function checkMTokenExists(config: Pick<UserConfig, "contract">, token: BaseToken) {
  const isExists = config.contract?.mTokens?.some(
    (m) => isSameETHAddress(m.spokeToken.address, token.address) && m.spokeToken.chainId === token.chainId,
  );
  if (!isExists) {
    throw new MTokenNotFoundError();
  }
}
