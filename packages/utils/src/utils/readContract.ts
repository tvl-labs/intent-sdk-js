import { UserConfig } from "../types/config";
import { Abi, Address } from "../types";
import {
  encodeFunctionData,
  decodeFunctionResult,
  type ContractFunctionName,
  type EncodeFunctionDataParameters,
  type DecodeFunctionResultReturnType,
} from "viem";
import { toHex } from "./toHex";
import { requestAccounts } from "./requestAccounts";
import { getChainRPCURLFromConfig } from "./getChainRPCURL";
import { getEthRPC } from "./getEthRPC";

/**
 * Helper function to decode function result with proper type inference.
 * Uses generics to maintain type safety while working around viem's complex type system.
 */
function decodeResult<const abi extends Abi | readonly unknown[], functionName extends ContractFunctionName<abi>>(
  parameters: EncodeFunctionDataParameters<abi, functionName>,
  data: `0x${string}`,
): DecodeFunctionResultReturnType<abi, functionName> {
  return decodeFunctionResult<abi, functionName>({
    abi: parameters.abi,
    functionName: parameters.functionName,
    data,
  } as Parameters<typeof decodeFunctionResult<abi, functionName>>[0]) as DecodeFunctionResultReturnType<
    abi,
    functionName
  >;
}

export async function readContract<
  const abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi> = ContractFunctionName<abi>,
>(
  config: Pick<UserConfig, "adapter" | "chains">,
  to: Address,
  chainId: number,
  parameters: EncodeFunctionDataParameters<abi, functionName>,
  options?: {
    from?: Address;
    blockNumber?: bigint;
    value?: bigint;
  },
): Promise<DecodeFunctionResultReturnType<abi, functionName>> {
  const from = options?.from ?? (await requestAccounts(config))[0];
  const rpc = getEthRPC(getChainRPCURLFromConfig(config, chainId));
  const hex = await rpc.eth_call(
    {
      from,
      to,
      data: encodeFunctionData<abi, functionName>(parameters),
      value: options?.value ? toHex(options.value) : undefined,
    },
    options?.blockNumber ? toHex(options.blockNumber) : "latest",
  );
  return decodeResult<abi, functionName>(parameters, hex);
}
