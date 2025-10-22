import type { Address, UserConfig } from "../types";
import { MTokenManagerArtifact } from "../abis/MTokenManagerArtifact";
import { ContractNotFoundError } from "./error";
import { getMedusaProvider } from "../medusa";

export async function getMTokenBalance(
  config: Pick<UserConfig, "adapter" | "contract" | "chainId"> | Pick<UserConfig, "medusaURL">,
  mTokenAddress: Address,
  account: Address,
) {
  if ("medusaURL" in config) {
    const hex = await getMedusaProvider(config).getMtokenBalanceByAuthor(account, mTokenAddress);
    return BigInt(hex);
  }
  const mTokenManagerAddress = config.contract?.mTokenManager;
  if (!mTokenManagerAddress) {
    throw new ContractNotFoundError("MTokenManager address not found in config");
  }
  return config.adapter.contractCaller.read<bigint>({
    abi: MTokenManagerArtifact,
    address: mTokenManagerAddress,
    functionName: "getBalanceOfUser",
    args: [account, mTokenAddress],
    chainId: config.chainId,
  });
}
