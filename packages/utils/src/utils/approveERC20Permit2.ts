import { MAX_UINT_256, PERMIT2_ADDRESS } from "../config";
import type { BaseToken, UserConfig } from "../types";
import { pickABIWithName } from "./pickABIWithName";
import { ERC20_ABI } from "../abis";
import { writeContract } from "./writeContract";

export async function approveERC20Permit2(config: Pick<UserConfig, "adapter" | "chains">, token: BaseToken) {
  return writeContract(config, token.address, {
    chainId: token.chainId,
    abi: pickABIWithName(ERC20_ABI, "approve"),
    functionName: "approve",
    args: [PERMIT2_ADDRESS, MAX_UINT_256],
  });
}
