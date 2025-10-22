import type { Address, BaseToken, UserConfig } from "../types";
import { TimeoutError } from "./error";
import { delay } from "./delay";
import { getERC20Balance } from "./getERC20Balance";

export async function waitForErc20BalanceUpdate(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract">,
  token: BaseToken,
  expectedBalance: bigint,
  address: Address,
  options?: {
    interval?: number;
    timeout?: number;
  },
) {
  const interval = options?.interval ?? 2_000;
  const timeout = options?.timeout ?? 1_000 * 60 * 5;
  const start = Date.now();
  if (!expectedBalance || expectedBalance <= 0n) {
    throw new Error("Expected balance must be a positive value");
  }
  while (true) {
    const balance = await getERC20Balance(config, token.chainId, token.address, address);
    if (balance >= expectedBalance) {
      return balance;
    }
    if (Date.now() - start > timeout) {
      throw new TimeoutError("Timeout waiting for transaction receipt");
    }
    await delay(interval);
  }
}
