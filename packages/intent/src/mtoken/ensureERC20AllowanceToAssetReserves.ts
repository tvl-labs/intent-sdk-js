import type { Address, BaseToken, UserConfig } from "@arcadia-network/utils";
import { getAssetReservesContractAddress, waitForTransactionReceiptWithChainId } from "@arcadia-network/utils";
import { ERC20_ALLOWANCE, ERC20_APPROVE } from "@arcadia-network/utils";

export async function ensureERC20AllowanceToAssetReserves(
  config: Pick<UserConfig, "adapter" | "chains" | "contract">,
  sourceToken: BaseToken,
  amount: bigint,
  address: Address,
  options?: {
    wait?: boolean;
  },
) {
  const wait = options?.wait ?? true;
  const assetReservesContractAddress = getAssetReservesContractAddress(config, sourceToken.chainId);
  const allowance = await config.adapter.contractCaller.read<bigint>({
    address: sourceToken.address,
    functionName: "allowance",
    args: [address, assetReservesContractAddress],
    abi: ERC20_ALLOWANCE,
    chainId: sourceToken.chainId,
  });
  if (allowance >= amount) {
    return { allowance };
  }

  // Insufficient allowance
  const value = amount - allowance;
  const txHash = await config.adapter.contractCaller.write({
    address: sourceToken.address,
    functionName: "approve",
    args: [assetReservesContractAddress, value],
    abi: ERC20_APPROVE,
    chainId: sourceToken.chainId,
  });
  if (wait) {
    const receipt = await waitForTransactionReceiptWithChainId(config, sourceToken.chainId, txHash);
    return {
      receipt,
      txHash,
      allowance,
    };
  }
  return { txHash, allowance };
}
