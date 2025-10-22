import { createContext, type PropsWithChildren, useContext, useMemo } from "react";
import { type Chain, defineConfig, type UserConfig } from "@arcadia-network/utils";
import { WagmiAdapter } from "@arcadia-network/wagmi-adapter";
import { useConfig } from "wagmi";
import { convertViemChainToNativeChain } from "@arcadia-network/viem-adapter";

export type ProviderConfig = Omit<UserConfig, "adapter" | "chains"> & Partial<Pick<UserConfig, "chains">>;

export interface ContextValue {
  config: ReturnType<typeof defineConfig>;
}

const context = createContext<ContextValue>({
  config: defineConfig({}),
});

export function Provider({
  children,
  ...props
}: PropsWithChildren<
  Omit<ContextValue, "config"> & {
    config: ProviderConfig;
  }
>) {
  const config = useConfig();
  const adapter = useMemo(() => {
    const adapter = new WagmiAdapter(config as never);
    const chains = props.config.chains
      ? props.config.chains
      : config.chains.map<Chain>((chain) => convertViemChainToNativeChain(chain));
    return {
      config: {
        ...props.config,
        chains,
        adapter,
      },
    };
  }, [config, props.config]);
  return <context.Provider value={adapter}>{children}</context.Provider>;
}

export function useArcadiaConfig() {
  return useContext(context).config as UserConfig;
}
