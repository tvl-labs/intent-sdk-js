import type { Address, UserConfig } from "../types";
import { ERC20_ABI } from "../abis";

export async function getERC20Decimals(config: Pick<UserConfig, "adapter">, chainId: number, address: Address) {
  return config.adapter.contractCaller.read<bigint>({
    abi: ERC20_ABI,
    address: address,
    functionName: "decimals",
    chainId,
  });
}
