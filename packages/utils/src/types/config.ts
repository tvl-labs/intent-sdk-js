import type { WalletAdapter } from "./adapter";
import type { Chain, HexChainId } from "./chain";
import type { Address } from "./utils";
import type { MToken } from "./token";

export interface UserConfig {
  adapter: WalletAdapter;
  chainId: number;
  chains: Chain[];
  medusaURL: string;
  contract: {
    assetReserves?: Record<HexChainId, Address>;
    mTokens?: MToken[];
    intentBook?: Address;
    crossChainIntentBook?: Address;
    mTokenManager?: Address;
  };
  experimental?: UserConfigExperimental;
}

export interface UserConfigExperimental {
  /**
   * If true, skips including the EIP-712 domain. Useful for testing or off-chain flows.
   * @default false
   */
  ignoreSignIntentDomain?: boolean;
}
