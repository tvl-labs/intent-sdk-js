import type { Address, UserConfig } from "../types";
import { ERC20_ABI } from "../abis";

export function getERC20Balance(
  config: Pick<UserConfig, "adapter">,
  chainId: number,
  address: Address,
  account: Address,
) {
  return config.adapter.contractCaller.read<bigint>({
    abi: ERC20_ABI,
    address: address,
    functionName: "balanceOf",
    args: [account],
    chainId,
  });
}
