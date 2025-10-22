import type { Address, Hex, UserConfig } from "@arcadia-network/utils";
import { isSameETHAddress, MTokenNotFoundError, VaultNotFoundError } from "@arcadia-network/utils";
import { MTokenManagerArtifact, ERC20_APPROVE } from "@arcadia-network/utils";

export async function approveMTokenSpendByVault(
  config: Pick<UserConfig, "adapter" | "contract" | "chainId">,
  mTokenAddress: Address,
  vaultAddress: Address,
  amount: bigint,
): Promise<Hex> {
  const mToken = config.contract.mTokens?.find((m) => isSameETHAddress(m.address, mTokenAddress));
  if (!mToken) throw new MTokenNotFoundError();
  const vaultExists = await config.adapter.contractCaller.read<boolean>({
    address: config.contract.mTokenManager!,
    abi: MTokenManagerArtifact,
    functionName: "checkVaultExists",
    args: [vaultAddress],
    chainId: config.chainId,
  });
  if (!vaultExists) throw new VaultNotFoundError();
  return (await config.adapter.contractCaller.write({
    address: mToken.address,
    abi: ERC20_APPROVE,
    functionName: "approve",
    args: [vaultAddress, amount],
    chainId: config.chainId,
  })) as Hex;
}
