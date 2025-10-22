import { MAX_UINT_256, PERMIT2_ADDRESS } from "../config";
import type { BaseToken, Hex, UserConfig } from "../types";
import { pickABIWithName } from "./pickABIWithName";
import { ERC20_ABI } from "../abis";

export async function approveERC20Permit2(config: Pick<UserConfig, "adapter">, token: BaseToken) {
  return (await config.adapter.contractCaller.write({
    abi: pickABIWithName(ERC20_ABI, "approve"),
    address: token.address,
    functionName: "approve",
    args: [PERMIT2_ADDRESS, MAX_UINT_256],
    chainId: token.chainId,
  })) as Hex;
}
