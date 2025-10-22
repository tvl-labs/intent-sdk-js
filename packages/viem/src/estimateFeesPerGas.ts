import { type Address, type Chain, createPublicClient, http } from "viem";
import type { ContractCaller } from "@intents-sdk/utils";

export async function estimateFeesPerGas(
  chain: Chain,
  account: Address,
  params: Parameters<ContractCaller["write"]>[0],
) {
  const publicClient = createPublicClient({
    transport: http(chain.rpcUrls.default.http[0]),
    chain,
  });
  let gas = params.options?.gas;
  let maxFeePerGas = params.options?.maxFeePerGas;
  let maxPriorityFeePerGas = params.options?.maxPriorityFeePerGas;
  if (!gas) {
    gas = await publicClient.estimateContractGas({
      abi: params.abi,
      address: params.address,
      functionName: params.functionName,
      args: params.args,
      nonce: params.options?.nonce,
      account,
      ...(params.options?.value
        ? ({
            value: params.options.value,
          } as never)
        : {}),
    });
  }
  if (!params.options?.gasPrice && (!maxFeePerGas || !maxPriorityFeePerGas)) {
    const fees = await publicClient.estimateFeesPerGas({
      type: "eip1559",
    });
    maxFeePerGas = fees.maxFeePerGas;
    maxPriorityFeePerGas = fees.maxPriorityFeePerGas;
  }
  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
    gas,
  };
}
