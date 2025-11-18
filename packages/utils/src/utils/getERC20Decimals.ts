import type { Address, UserConfig } from "../types";
import { ERC20_ABI } from "../abis";
import { readContract } from "./readContract";

export async function getERC20Decimals(
  config: Pick<UserConfig, "adapter" | "chains">,
  chainId: number,
  address: Address,
) {
  return readContract(config, address, chainId, {
    abi: ERC20_ABI,
    functionName: "decimals",
    args: [],
  });
}
