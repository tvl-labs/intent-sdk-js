import { isApprovedERC20Permit2, waitForTransactionReceiptWithChainId, approveERC20Permit2 } from "@intents-sdk/utils";
import type { Address, BaseToken, Hex, UserConfig, TransactionReceipt } from "@intents-sdk/utils";

type MethodReturn<R extends boolean> = (R extends true ? TransactionReceipt : Hex) | true;

export async function ensureERC20Permit2Approved<R extends boolean = true>(
  config: Pick<UserConfig, "adapter" | "chains">,
  spokeToken: BaseToken,
  address: Address,
  options?: {
    waitTransactionReceipt?: R;
    expected?: bigint;
  },
): Promise<MethodReturn<R>> {
  const waitTransactionReceipt = options?.waitTransactionReceipt ?? true;
  const isApprovedPermit2 = await isApprovedERC20Permit2(config, spokeToken, address, { expected: options?.expected });
  if (!isApprovedPermit2) {
    const txHash = await approveERC20Permit2(config, spokeToken);
    if (!waitTransactionReceipt) return txHash as MethodReturn<R>;
    return (await waitForTransactionReceiptWithChainId(config, spokeToken.chainId, txHash)) as MethodReturn<R>;
  }
  return true;
}
