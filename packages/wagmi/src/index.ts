import {
  AccountNotConnectedError,
  ChainNotFoundError,
  type ContractCaller,
  type Eip1193Provider,
  type WalletAdapter,
} from "@arcadia-network/utils";
import { type Config, getAccount, readContract, switchChain, writeContract } from "@wagmi/core";
import { estimateFeesPerGas } from "@arcadia-network/viem-adapter";

export class WagmiAdapter implements WalletAdapter {
  protected readonly provider: Eip1193Provider | undefined;

  constructor(protected readonly config: Config) {}

  async request<T = any>(args: { method: string; params?: unknown[] }): Promise<T> {
    let provider = this.provider;
    if (!provider) {
      const { connector } = getAccount(this.config);
      if (!connector) throw new AccountNotConnectedError();
      provider = (await connector.getProvider()) as Eip1193Provider;
    }
    return provider.request(args);
  }

  get contractCaller() {
    return {
      read: async <T = unknown>(params: Parameters<ContractCaller["read"]>[0]): Promise<T> => {
        const chain = this.config.chains.find((x) => x.id === params.chainId);
        if (!chain) throw new ChainNotFoundError(`Chain ${params.chainId} not supported`);
        return (await readContract(this.config, {
          abi: params.abi,
          address: params.address,
          functionName: params.functionName,
          args: params.args,
          chainId: params.chainId,
        })) as Promise<T>;
      },
      write: async (params) => {
        const chain = this.config.chains.find((x) => x.id === params.chainId);
        if (!chain) throw new ChainNotFoundError(`Chain ${params.chainId} not supported`);
        await switchChain(this.config, {
          chainId: params.chainId,
        });
        const { address } = getAccount(this.config);
        if (!address) throw new AccountNotConnectedError();
        const { gas, maxFeePerGas, maxPriorityFeePerGas } = await estimateFeesPerGas(chain, address, params);
        return writeContract(this.config, {
          abi: params.abi,
          address: params.address,
          functionName: params.functionName,
          args: params.args,
          value: params.options?.value,
          chainId: params.chainId,
          gas,
          ...(params.options?.gasPrice
            ? {
                gasPrice: params.options.gasPrice,
              }
            : {
                maxFeePerGas,
                maxPriorityFeePerGas,
              }),
          nonce: params.options?.nonce,
          account: address,
        });
      },
    } satisfies ContractCaller;
  }
}
