import type { Address, BaseToken, UserConfig } from "../types";
import { ERC20_ALLOWANCE } from "../abis";
import { MAX_UINT_256, PERMIT2_ADDRESS } from "../config";
import { readContract } from "./readContract";

export async function isApprovedERC20Permit2(
  config: Pick<UserConfig, "adapter" | "chains">,
  token: BaseToken,
  owner: Address,
  options?: {
    expected?: bigint;
  },
) {
  const expected = options?.expected ?? MAX_UINT_256;
  const allowance = await readContract(config, token.address, token.chainId, {
    abi: ERC20_ALLOWANCE,
    functionName: "allowance",
    args: [owner, PERMIT2_ADDRESS],
  });
  return allowance >= expected;
}
