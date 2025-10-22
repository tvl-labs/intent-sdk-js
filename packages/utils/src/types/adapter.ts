import type { Abi } from "./abi";
import type { Address } from "./utils";

/**
 * Chain ID as per EIP-155.
 * See: https://eips.ethereum.org/EIPS/eip-155
 */
export type ChainId = number;

/**
 * A function name from the ABI.
 */
export type FunctionName = string;

/**
 * Represents a caller that can interact with smart contracts on a blockchain.
 */
export interface ContractCaller {
  /**
   * Performs a read-only contract call (eth_call).
   */
  read<T = unknown>(params: {
    abi: Abi;
    address: Address;
    functionName: FunctionName;
    args?: unknown[];
    chainId: ChainId;
    options?: {
      blockTag?: string | number;
    };
  }): Promise<T>;

  /**
   * Sends a transaction that modifies contract state (eth_sendTransaction).
   */
  write(params: {
    abi: Abi;
    address: Address;
    functionName: FunctionName;
    chainId: ChainId;
    args?: unknown[];
    options?: {
      value?: bigint;
      gas?: bigint;
      gasPrice?: bigint;
      nonce?: number;
      maxPriorityFeePerGas?: bigint;
      maxFeePerGas?: bigint;
    };
  }): Promise<string>;
}

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
export interface WalletAdapter extends Eip1193Provider {
  contractCaller: ContractCaller;
}
