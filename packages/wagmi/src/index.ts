import { AccountNotConnectedError, type Eip1193Provider, type WalletAdapter } from "@intents-sdk/utils";
import { type Config, getAccount } from "@wagmi/core";

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
}
