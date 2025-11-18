/**
 * EIP-1193 Provider Interface.
 * See: https://eips.ethereum.org/EIPS/eip-1193
 */
export interface Eip1193Provider {
  request<T = any>(args: { method: string; params?: unknown[] }): Promise<T>;
}

/**
 * Wallet Adapter that wraps an EIP-1193 provider and includes contract interaction utils.
 */
export interface WalletAdapter extends Eip1193Provider {}
