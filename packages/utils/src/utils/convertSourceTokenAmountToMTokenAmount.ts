import type { BaseToken, UserConfig } from "../types";
import { getMTokenBySourceToken } from "./getMTokenBySourceToken";

export function convertSourceTokenAmountToMTokenAmount(
  config: Pick<UserConfig, "contract">,
  token: BaseToken,
  amount: bigint,
) {
  const mToken = getMTokenBySourceToken(config, token);
  const decimals = BigInt(mToken.spokeToken.decimals);
  return amount * 10n ** BigInt(BigInt(mToken.decimals) - decimals);
}
