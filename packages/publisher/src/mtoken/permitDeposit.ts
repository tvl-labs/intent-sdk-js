import { type Address, type Hex, PERMIT_DEPOSIT, PERMIT_DEPOSIT_PAYLOAD, type UserConfig } from "@intents-sdk/utils";
import { getAssetReservesContractAddress, writeContract } from "@intents-sdk/utils";
import type { PermitTransferFrom } from "./buildDepositPermit";
import { quoteRelayDeposit, DEFAULT_GAS_LIMIT } from "./quoteRelayDeposit";

/**
 * Deposit ERC20 with permit2.
 *
 * @example
 *
 * const { typedData, ...options } = buildDepositPermit(config, spokeToken, amount);
 * const signature = await signTypeDataV4(config, depositor, typedData);
 * await permitDeposit(config, {
 *   ...options,
 *   depositor,
 *   signature,
 * });
 */
export async function permitDeposit(
  config: Pick<UserConfig, "adapter" | "chains" | "contract">,
  options: {
    chainId: number;
    permit: PermitTransferFrom;
    depositor: Address;
    payload?: Hex;
    gasLimit?: bigint;
    signature: Hex;
    payableValue?: bigint;
    gas?: bigint;
    gasPrice?: bigint;
  },
) {
  const value =
    options?.payableValue ??
    (await quoteRelayDeposit(
      config,
      {
        address: options.permit.permitted.token,
        chainId: options.chainId,
      },
      options.permit.permitted.amount,
      {
        depositor: options.depositor,
        payload: options?.payload,
        gasLimit: options?.gasLimit,
      },
    ));
  const assetReservesContractAddress = getAssetReservesContractAddress(config, options.chainId);
  const writeContractOptions = {
    value,
    gas: options?.gas,
    gasPrice: options?.gasPrice,
  };
  if (options.payload || options.gasLimit) {
    return await writeContract(config, assetReservesContractAddress, {
      chainId: options.chainId,
      abi: [PERMIT_DEPOSIT_PAYLOAD],
      args: [
        options.permit,
        options.depositor,
        options.payload ?? "0x",
        options.gasLimit ?? DEFAULT_GAS_LIMIT,
        options.signature,
      ],
      functionName: "permitDeposit",
      ...writeContractOptions,
    });
  }
  return await writeContract(config, assetReservesContractAddress, {
    chainId: options.chainId,
    abi: [PERMIT_DEPOSIT],
    args: [options.permit, options.depositor, options.signature],
    functionName: "permitDeposit",
    ...writeContractOptions,
  });
}
