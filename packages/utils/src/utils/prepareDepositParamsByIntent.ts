import type { MedusaIntent, UserConfig } from "../types";
import { getSourceTokenByMToken } from "./getSourceTokenByMToken";
import { getMTokenBySourceToken } from "./getMTokenBySourceToken";
import { convertUnits } from "./convertUnits";

export function prepareDepositParamsByIntent(config: Pick<UserConfig, "contract">, intent: MedusaIntent) {
  const spokeToken = getSourceTokenByMToken(config, intent.srcMToken);
  const mToken = getMTokenBySourceToken(config, spokeToken);
  const amount = convertUnits(BigInt(intent.srcAmount), mToken.decimals, spokeToken.decimals);
  return { amount, mToken, spokeToken };
}
