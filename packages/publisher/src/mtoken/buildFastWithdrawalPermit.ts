import type { Address, BaseToken, FastWithdrawalPermit, Hex, UserConfig } from "@intents-sdk/utils";
import { randomHex, requestAccounts, toHex } from "@intents-sdk/utils";

export async function buildFastWithdrawalPermit(
  config: Pick<UserConfig, "chainId" | "adapter">,
  spokeToken: BaseToken,
  amount: bigint,
  options?: {
    caller?: Address;
    nonce?: Hex;
  },
) {
  const [address] = await requestAccounts(config);
  return {
    spokeChainId: spokeToken.chainId,
    token: spokeToken.address,
    user: address,
    caller: options?.caller ?? address,
    amount: toHex(amount),
    nonce: options?.nonce ?? randomHex(),
  } satisfies FastWithdrawalPermit;
}
