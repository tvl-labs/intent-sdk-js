import { ASSET_RESERVES_ABI } from "@intents-sdk/utils";
import type { Address, FastWithdrawalPermit, Hex, UserConfig } from "@intents-sdk/utils";
import { getAssetReservesContractAddress, writeContract } from "@intents-sdk/utils";

/**
 * Withdraw tokens from the AssetReserves with a FastWithdrawalPermit. Will send a transaction to the spoke chain.
 *
 * @remarks
 *
 * The transaction sender must be the same as `permit.caller`.
 *
 * @param config - The user configuration.
 * @param permit - The FastWithdrawalPermit.
 * @param receiver - The address to receive the tokens.
 * @param userSignature - The signature of the user.
 * @param operatorSignature - The signature of the operator.
 * @param options - The options for the transaction.
 * @returns The transaction hash.
 */
export async function withdrawWithPermit(
  config: Pick<UserConfig, "adapter" | "chains" | "contract">,
  permit: FastWithdrawalPermit,
  receiver: Address,
  userSignature: Hex,
  operatorSignature: Hex,
  options?: {
    gas?: bigint;
    gasPrice?: bigint;
    nonce?: number;
    maxPriorityFeePerGas?: bigint;
    maxFeePerGas?: bigint;
  },
): Promise<Hex> {
  const address = getAssetReservesContractAddress(config, permit.spokeChainId);
  return await writeContract(config, address, {
    chainId: permit.spokeChainId,
    abi: ASSET_RESERVES_ABI,
    functionName: "withdrawWithPermit",
    args: [
      {
        ...permit,
        nonce: BigInt(permit.nonce as string),
        amount: BigInt(permit.amount as string),
      },
      receiver,
      userSignature,
      operatorSignature,
    ],
    ...options,
  });
}

export async function withdrawWithPermitAndWitness(
  config: Pick<UserConfig, "adapter" | "chains" | "contract">,
  permit: FastWithdrawalPermit,
  receiver: Address,
  witness: Hex,
  witnessTypeString: string,
  userSignature: Hex,
  operatorSignature: Hex,
  options?: {
    gas?: bigint;
    gasPrice?: bigint;
    nonce?: number;
    maxPriorityFeePerGas?: bigint;
    maxFeePerGas?: bigint;
  },
): Promise<Hex> {
  const address = getAssetReservesContractAddress(config, permit.spokeChainId);
  return await writeContract(config, address, {
    chainId: permit.spokeChainId,
    abi: ASSET_RESERVES_ABI,
    functionName: "withdrawWithPermitAndWitness",
    args: [
      {
        ...permit,
        nonce: BigInt(permit.nonce as string),
        amount: BigInt(permit.amount as string),
      },
      receiver,
      witness,
      witnessTypeString,
      userSignature,
      operatorSignature,
    ],
    ...options,
  });
}
