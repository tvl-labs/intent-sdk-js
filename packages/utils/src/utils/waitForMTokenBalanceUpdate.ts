import type { Address, BaseToken, UserConfig } from "../types";
import { getMTokenBySourceToken } from "./getMTokenBySourceToken";
import { TimeoutError } from "./error";
import { delay } from "./delay";
import { getMTokenBalance } from "./getMTokenBalance";

type ExpectedBalance =
  | bigint
  | { greaterThan: bigint }
  | { lessThan: bigint }
  | { greaterThanOrEqual: bigint }
  | { lessThanOrEqual: bigint };

async function waitForMTokenBalanceUpdateWithMTokenAddress(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract"> | Pick<UserConfig, "medusaURL">,
  mTokenAddress: Address,
  expectedBalance: ExpectedBalance,
  address: Address,
  options?: {
    interval?: number;
    timeout?: number;
  },
) {
  const interval = options?.interval ?? 2_000;
  const timeout = options?.timeout ?? 1_000 * 60 * 5;
  const start = Date.now();
  while (true) {
    const balance = await getMTokenBalance(config, mTokenAddress, address);
    if (typeof expectedBalance === "bigint") {
      if (balance === expectedBalance) {
        return balance;
      }
    } else {
      if ("greaterThan" in expectedBalance) {
        if (balance > expectedBalance.greaterThan) {
          return balance;
        }
      } else if ("lessThan" in expectedBalance) {
        if (balance < expectedBalance.lessThan) {
          return balance;
        }
      } else if ("greaterThanOrEqual" in expectedBalance) {
        if (balance >= expectedBalance.greaterThanOrEqual) {
          return balance;
        }
      } else if ("lessThanOrEqual" in expectedBalance) {
        if (balance <= expectedBalance.lessThanOrEqual) {
          return balance;
        }
      }
    }
    if (Date.now() - start > timeout) {
      throw new TimeoutError("Timeout waiting for transaction receipt");
    }
    await delay(interval);
  }
}

export async function waitForMTokenBalanceUpdate(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract"> | Pick<UserConfig, "medusaURL" | "contract">,
  mTokenAddress: Address,
  expectedBalance: ExpectedBalance,
  address: Address,
  options?: {
    interval?: number;
    timeout?: number;
  },
): Promise<bigint>;
export async function waitForMTokenBalanceUpdate(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract"> | Pick<UserConfig, "medusaURL" | "contract">,
  sourceToken: BaseToken,
  expectedBalance: ExpectedBalance,
  address: Address,
  options?: {
    interval?: number;
    timeout?: number;
  },
): Promise<bigint>;
export async function waitForMTokenBalanceUpdate(
  config: Pick<UserConfig, "adapter" | "chainId" | "contract"> | Pick<UserConfig, "medusaURL" | "contract">,
  sourceTokenOrMTokenAddress: BaseToken | Address,
  expectedBalance: ExpectedBalance,
  address: Address,
  options?: {
    interval?: number;
    timeout?: number;
  },
): Promise<bigint> {
  const mToken =
    typeof sourceTokenOrMTokenAddress === "string"
      ? sourceTokenOrMTokenAddress
      : getMTokenBySourceToken(config, sourceTokenOrMTokenAddress).address;
  return waitForMTokenBalanceUpdateWithMTokenAddress(config, mToken, expectedBalance, address, options);
}
