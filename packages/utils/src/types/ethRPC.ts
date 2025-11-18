import type { Address, Hex } from "./utils";

/**
 * Ethereum RPC provider interface with common JSON-RPC methods.
 * This interface defines the standard Ethereum RPC methods that can be called
 * through the JSON-RPC provider proxy.
 */
export interface EthProvider {
  /**
   * Executes a message call transaction, which is directly executed in the VM of the node,
   * without creating any transaction on the block chain.
   * @param params - Call parameters: { from?, to, data?, value?, gas?, gasPrice? }
   * @param blockNumber - Block number or tag
   * @returns The return value of executed contract
   */
  eth_call(
    params: {
      from?: Address;
      to: Address;
      data?: Hex;
      value?: Hex;
      gas?: Hex;
      gasPrice?: Hex;
    },
    blockNumber: Hex | "latest" | "earliest" | "pending",
  ): Promise<Hex>;

  /**
   * Returns the balance of the account of given address.
   * @param address - The address to check the balance for
   * @param blockNumber - Block number or tag
   * @returns The balance of the account in wei
   */
  eth_getBalance(address: Address, blockNumber: Hex | "latest" | "earliest" | "pending"): Promise<Hex>;

  /**
   * Returns the current block number.
   * @returns The current block number in hex format
   */
  eth_blockNumber(): Promise<Hex>;

  /**
   * Returns the chain ID of the current network.
   * @returns The chain ID in hex format
   */
  eth_chainId(): Promise<Hex>;

  /**
   * Returns the transaction receipt for the given transaction hash.
   * @param transactionHash - The transaction hash
   * @returns The transaction receipt object or null if not found
   */
  eth_getTransactionReceipt(transactionHash: Hex): Promise<{
    transactionHash: Hex;
    transactionIndex: Hex;
    blockHash: Hex;
    blockNumber: Hex;
    from: Address;
    to: Address | null;
    cumulativeGasUsed: Hex;
    effectiveGasPrice?: Hex;
    gasUsed: Hex;
    contractAddress: Address | null;
    logs: Array<{
      address: Address;
      topics: Hex[];
      data: Hex;
      blockNumber: Hex;
      transactionHash: Hex;
      transactionIndex: Hex;
      logIndex: Hex;
      removed: boolean;
    }>;
    logsBloom: Hex;
    status: Hex;
    type?: Hex;
  } | null>;

  /**
   * Returns information about a transaction by hash.
   * @param transactionHash - The transaction hash
   * @returns The transaction object or null if not found
   */
  eth_getTransactionByHash(transactionHash: Hex): Promise<{
    hash: Hex;
    nonce: Hex;
    blockHash: Hex | null;
    blockNumber: Hex | null;
    transactionIndex: Hex | null;
    from: Address;
    to: Address | null;
    value: Hex;
    gasPrice: Hex;
    gas: Hex;
    input: Hex;
    v: Hex;
    r: Hex;
    s: Hex;
  } | null>;

  /**
   * Returns code at a given address.
   * @param address - The address to get the code for
   * @param blockNumber - Block number or tag
   * @returns The code at the given address
   */
  eth_getCode(address: Address, blockNumber: Hex | "latest" | "earliest" | "pending"): Promise<Hex>;

  /**
   * Returns information about a block by number.
   * @param blockNumber - Block number or tag
   * @param fullTransactions - If true, returns full transaction objects, otherwise returns transaction hashes
   * @returns The block object
   */
  eth_getBlockByNumber(
    blockNumber: Hex | "latest" | "earliest" | "pending",
    fullTransactions: boolean,
  ): Promise<{
    number: Hex;
    hash: Hex;
    parentHash: Hex;
    nonce: Hex;
    sha3Uncles: Hex;
    logsBloom: Hex;
    transactionsRoot: Hex;
    stateRoot: Hex;
    receiptsRoot: Hex;
    miner: Address;
    difficulty: Hex;
    totalDifficulty: Hex;
    extraData: Hex;
    size: Hex;
    gasLimit: Hex;
    gasUsed: Hex;
    timestamp: Hex;
    transactions:
      | Hex[]
      | Array<{
          hash: Hex;
          nonce: Hex;
          blockHash: Hex;
          blockNumber: Hex;
          transactionIndex: Hex;
          from: Address;
          to: Address | null;
          value: Hex;
          gasPrice: Hex;
          gas: Hex;
          input: Hex;
        }>;
    uncles: Hex[];
  } | null>;

  /**
   * Returns the number of transactions sent from an address.
   * @param address - The address to get the transaction count for
   * @param blockNumber - Block number or tag
   * @returns The nonce of the account
   */
  eth_getTransactionCount(address: Address, blockNumber: Hex | "latest" | "earliest" | "pending"): Promise<Hex>;

  /**
   * Estimates the gas necessary to complete a transaction.
   * @param transactionObject - Transaction object: { from?, to, data?, value?, gas?, gasPrice? }
   * @returns The amount of gas used in hex format
   */
  eth_estimateGas(transactionObject: {
    from?: Address;
    to?: Address;
    data?: Hex;
    value?: Hex;
    gas?: Hex;
    gasPrice?: Hex;
  }): Promise<Hex>;

  /**
   * Returns the current gas price in wei.
   * @returns The current gas price in hex format
   */
  eth_gasPrice(): Promise<Hex>;
}
