import { type Chain, createPublicClient, createWalletClient, custom, http, toHex } from "viem";
import type { ContractCaller, Eip1193Provider, WalletAdapter } from "@intents-sdk/utils";
import { convertViemChainToNativeChain } from "./convertViemChainToNativeChain";
import { estimateFeesPerGas } from "./estimateFeesPerGas";

export * from "./convertViemChainToNativeChain";
export * from "./estimateFeesPerGas";

export class ViemWalletAdapter implements WalletAdapter {
  constructor(
    protected readonly provider: Eip1193Provider,
    protected readonly chains: Chain[] | readonly [Chain, ...Chain[]],
  ) {}

  protected async switchChain(chainId: number) {
    const chain = this.chains.find((x) => x.id === chainId);
    if (!chain) throw new Error(`Chain ${chainId} not supported`);
    const targetChainId = toHex(chainId);
    try {
      const currentChainId = await this.provider.request({
        method: "eth_chainId",
      });
      if (currentChainId === targetChainId) return;
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (err: any) {
      if (err?.code === 4902 || /not found|unrecognized|missing/i.test(err?.message)) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [convertViemChainToNativeChain(chain)],
        });
        await this.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } else {
        throw err;
      }
    }
  }

  get contractCaller() {
    return {
      read: async <T = unknown>(params: Parameters<ContractCaller["read"]>[0]): Promise<T> => {
        const chain = this.chains.find((x) => x.id === params.chainId);
        if (!chain) throw new Error(`Chain ${params.chainId} not supported`);
        const client = createPublicClient({
          transport: http(chain.rpcUrls.default.http[0]),
          chain,
        });
        return client.readContract({
          abi: params.abi,
          address: params.address,
          functionName: params.functionName,
          args: params.args,
        }) as Promise<T>;
      },
      write: async (params) => {
        const chain = this.chains.find((x) => x.id === params.chainId);
        if (!chain) throw new Error(`Chain ${params.chainId} not supported`);
        await this.switchChain(params.chainId);
        const client = createPublicClient({
          transport: http(chain.rpcUrls.default.http[0]),
          chain,
        });
        const walletClient = createWalletClient({
          transport: custom(this.provider),
          chain,
        });
        const [address] = await walletClient.requestAddresses();
        const { gas, maxFeePerGas, maxPriorityFeePerGas } = await estimateFeesPerGas(chain, address, params);
        const { request } = await client.simulateContract({
          abi: params.abi,
          address: params.address,
          functionName: params.functionName,
          args: params.args,
          value: params.options?.value,
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
        return walletClient.writeContract(request);
      },
    } satisfies ContractCaller;
  }

  async request<T = any>(args: { method: string; params?: unknown[] }): Promise<T> {
    return this.provider.request(args);
  }
}
