import type { Address, BaseToken, UserConfig } from "@intents-sdk/utils";
import {
  getAssetReservesContractAddress,
  waitForTransactionReceiptWithChainId,
  readContract,
  writeContract,
} from "@intents-sdk/utils";
import { ERC20_ALLOWANCE, ERC20_APPROVE } from "@intents-sdk/utils/abis";

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
  const allowance = await readContract(config, sourceToken.address, sourceToken.chainId, {
    abi: ERC20_ALLOWANCE,
    functionName: "allowance",
    args: [address, assetReservesContractAddress],
  });
  if (allowance >= amount) {
    return { allowance };
  }

  // Insufficient allowance
  const value = amount - allowance;
  const txHash = await writeContract(config, sourceToken.address, {
    chainId: sourceToken.chainId,
    functionName: "approve",
    args: [assetReservesContractAddress, value],
    abi: ERC20_APPROVE,
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
