import type { Address, UserConfig } from "../types";
import { ERC20_ABI } from "../abis";
import { readContract } from "./readContract";

export function getERC20Balance(
  config: Pick<UserConfig, "adapter" | "chains">,
  chainId: number,
  address: Address,
  account: Address,
) {
  return readContract(config, address, chainId, {
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [account],
  });
}
