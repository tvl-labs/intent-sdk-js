import { type BaseToken, DEPOSIT, DEPOSIT_PAYLOAD, type Hex, type UserConfig } from "@intents-sdk/utils";
import { getAssetReservesContractAddress, isNativeAddress, writeContract } from "@intents-sdk/utils";
import { quoteRelayDeposit, DEFAULT_GAS_LIMIT } from "./quoteRelayDeposit";

/**
 * Deposit ERC20 or native currency, with optional payload and (hyperlane) gas limit.
 */
export async function deposit(
  config: Pick<UserConfig, "adapter" | "contract" | "chains">,
  spoke: BaseToken,
  amount: bigint,
  options?: {
    payableValue?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
    payload?: Hex;
    gasLimit?: bigint;
  },
) {
  const assetReservesContractAddress = getAssetReservesContractAddress(config, spoke.chainId);

  const quote = () =>
    quoteRelayDeposit(config, spoke, amount, {
      payload: options?.payload,
      gasLimit: options?.gasLimit,
    });
  const value = options?.payableValue ?? (await quote()) + (isNativeAddress(spoke.address) ? amount : 0n);
  const writeContractOptions = {
    chainId: spoke.chainId,
    value,
    gas: options?.gas,
    gasPrice: options?.gasPrice,
  };

  // Build args based on whether payload and gasLimit are provided
  if (options?.payload || options?.gasLimit) {
    return writeContract(config, assetReservesContractAddress, {
      abi: [DEPOSIT_PAYLOAD],
      functionName: "deposit",
      args: [spoke.address, amount, options.payload ?? "0x", options.gasLimit ?? DEFAULT_GAS_LIMIT],
      ...writeContractOptions,
    });
  }

  return writeContract(config, assetReservesContractAddress, {
    abi: [DEPOSIT],
    functionName: "deposit",
    args: [spoke.address, amount],
    ...writeContractOptions,
  });
}
