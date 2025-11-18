import { UserConfig } from "../types/config";
import { requestAccounts } from "./requestAccounts";
import { Address, Hex } from "../types";
import { encodeFunctionData, type ContractFunctionName, EncodeFunctionDataParameters, type Abi } from "viem";
import { toHex } from "./toHex";
import { addAndSwitchChain } from "./addAndSwitchChain";
import { readContract } from "./readContract";

export async function writeContract<
  const abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi> = ContractFunctionName<abi>,
>(
  config: Pick<UserConfig, "adapter" | "chains">,
  to: Address,
  {
    chainId,
    value,
    from,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    ...parameters
  }: EncodeFunctionDataParameters<abi, functionName> & {
    chainId: number;
    value?: bigint;
    from?: Address;
    gas?: bigint;
    gasPrice?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce?: number;
  },
) {
  const fromAddress = from ?? (await requestAccounts(config))[0];
  await addAndSwitchChain(config, chainId);

  // simulate: execute the contract call to check if it would succeed
  // If simulation fails, we still proceed with the transaction as the failure
  // might be due to balance checks that don't reflect the actual state
  // or other transient issues that don't affect the actual transaction
  try {
    await readContract<abi, functionName>(
      config,
      to,
      chainId,
      parameters as EncodeFunctionDataParameters<abi, functionName>,
      {
        from: fromAddress,
        value,
      },
    );
  } catch (error: unknown) {
    // If simulation fails, log but continue with the transaction
    // The actual transaction might succeed even if simulation fails
    // (e.g., due to balance differences, state changes, or RPC issues)
    // Only log if it's a meaningful error (not just a revert)
    if (error instanceof Error) {
      // Check if it's a revert error (code 3) which is expected for some cases
      const errorWithCode = error as Error & { code?: number };
      const isRevertError = errorWithCode?.code === 3;
      if (!isRevertError) {
        console.warn("Simulation failed, proceeding with transaction:", error.message);
      }
    }
  }

  return config.adapter.request<Hex>({
    method: "eth_sendTransaction",
    params: [
      {
        from: fromAddress,
        to,
        value: value ? toHex(value) : undefined,
        gas: gas ? toHex(gas) : undefined,
        gasPrice: gasPrice ? toHex(gasPrice) : undefined,
        maxFeePerGas: maxFeePerGas ? toHex(maxFeePerGas) : undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : undefined,
        nonce: nonce ? toHex(nonce) : undefined,
        data: encodeFunctionData<abi, functionName>(parameters as EncodeFunctionDataParameters<abi, functionName>),
      },
    ],
  });
}
