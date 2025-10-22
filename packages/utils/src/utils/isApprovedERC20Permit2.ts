import type { Address, BaseToken, UserConfig } from "../types";
import { ERC20_ALLOWANCE } from "../abis";
import { MAX_UINT_256, PERMIT2_ADDRESS } from "../config";

export async function isApprovedERC20Permit2(
  config: Pick<UserConfig, "adapter">,
  token: BaseToken,
  owner: Address,
  options?: {
    expected?: bigint;
  },
) {
  const expected = options?.expected ?? MAX_UINT_256;
  const allowance = await config.adapter.contractCaller.read<bigint>({
    address: token.address,
    functionName: "allowance",
    args: [owner, PERMIT2_ADDRESS],
    abi: ERC20_ALLOWANCE,
    chainId: token.chainId,
  });
  return allowance >= expected;
}
