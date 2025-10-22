import type { UserConfig } from "@intents-sdk/utils";
import type { BaseToken } from "@intents-sdk/utils";
import { MTokenNotFoundError } from "@intents-sdk/utils";
import { isSameETHAddress } from "@intents-sdk/utils";

export function checkMTokenExists(config: Pick<UserConfig, "contract">, token: BaseToken) {
  const isExists = config.contract?.mTokens?.some(
    (m) => isSameETHAddress(m.spokeToken.address, token.address) && m.spokeToken.chainId === token.chainId,
  );
  if (!isExists) {
    throw new MTokenNotFoundError();
  }
}
