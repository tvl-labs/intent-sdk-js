import type { BaseToken, Hex, UserConfig } from "@arcadia-network/utils";
import { getAssetReservesContractAddress } from "@arcadia-network/utils";
import { ASSET_RESERVES_ABI } from "@arcadia-network/utils";
import { parseUnits } from "@arcadia-network/utils";
import { ChainNotFoundError, toHex } from "@arcadia-network/utils";
import type { BuildPermit2Result } from "./buildDepositERC20Permit2";

export async function depositERC20WithSignature(
  config: Pick<UserConfig, "chains" | "adapter" | "chainId" | "contract">,
  spoke: BaseToken,
  amount: bigint,
  permit2: BuildPermit2Result,
  signature: string,
  options?: {
    payableValue?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
  },
) {
  const chain = config.chains.find((x) => x.chainId === toHex(spoke.chainId));
  if (!chain) throw new ChainNotFoundError();
  const payableValue = options?.payableValue ?? parseUnits("0.0004", chain.nativeCurrency.decimals);
  const assetReservesContractAddress = getAssetReservesContractAddress(config, spoke.chainId);
  return (await config.adapter.contractCaller.write({
    address: assetReservesContractAddress,
    abi: ASSET_RESERVES_ABI,
    args: [spoke.address, amount, permit2.depositor, permit2.deadline, permit2.nonce, signature],
    functionName: "depositERC20WithSignature",
    chainId: spoke.chainId,
    options: {
      value: payableValue,
      gas: options?.gas,
      gasPrice: options?.gasPrice,
    },
  })) as Hex;
}
