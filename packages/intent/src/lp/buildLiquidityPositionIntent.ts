import { buildIntent } from "../intent/buildIntent";
import { type Address, type BaseToken, FillStructureStr, type UserConfig } from "@arcadia-network/utils";

export interface BuildLiquidityPositionIntentOptions {
  /**
   * Optional fee percentage (e.g. `0.01` for 1%) to deduct from the deposited amount.
   * The deducted portion will not be included in liquidity provisioning.
   */
  feePercentage?: number;

  /**
   * The earliest timestamp (in seconds) at which the resulting intent becomes valid.
   * Useful for scheduling or delaying the activation of the liquidity provision.
   */
  validAfter?: string;

  /**
   * The latest timestamp (in seconds) at which the resulting intent remains valid.
   * This represents the expiration time for the liquidity provision.
   */
  validBefore?: string;
}

export function buildLiquidityPositionIntent(
  config: Pick<UserConfig, "adapter" | "contract" | "chains" | "chainId" | "medusaURL">,
  sourceToken: BaseToken,
  destinationTokens: BaseToken[],
  amount: bigint,
  address: Address,
  options?: BuildLiquidityPositionIntentOptions,
) {
  return buildIntent(config, address, sourceToken, destinationTokens, amount, FillStructureStr.PercentageFilled, {
    feePercentage: options?.feePercentage,
    validAfter: options?.validAfter,
    validBefore: options?.validBefore ?? BigInt("0xffffffffffffffff").toString(),
  });
}
