/**
 * Represents a parameter used in functions, events, or errors.
 */
export interface AbiParameter {
  /** Name of the parameter */
  name: string;

  /** Type of the parameter (e.g. 'uint256', 'address', 'tuple[]') */
  type: SolidityType;

  /** Optional Solidity-internal type (e.g. 'uint256[3]', 'struct Foo.Bar') */
  internalType?: string;

  /** If the parameter is a tuple or tuple[], defines its subcomponents */
  components?: AbiParameter[];

  /** Marks the parameter as indexed (used in events only) */
  indexed?: boolean;
}

/**
 * Defines a standard Solidity function.
 */
export interface AbiFunction {
  type: "function";

  /** Name of the function */
  name: string;

  /** List of input parameters */
  inputs: AbiParameter[];

  /** List of output parameters */
  outputs: AbiParameter[];

  /** State mutability keyword */
  stateMutability: "pure" | "view" | "nonpayable" | "payable";

  /** Ethers.js compatibility: marks the function as constant */
  constant?: boolean;

  /** Ethers.js compatibility: estimated gas for the function */
  gas?: number;
}

/**
 * Defines a constructor function (used during contract deployment).
 */
export interface AbiConstructor {
  type: "constructor";

  /** List of input parameters */
  inputs: AbiParameter[];

  /** State mutability keyword */
  stateMutability: "nonpayable" | "payable";

  /** Ethers.js compatibility: estimated gas for the constructor */
  gas?: number;
}

/**
 * Defines a Solidity event.
 */
export interface AbiEvent {
  type: "event";

  /** Name of the event */
  name: string;

  /** List of event parameters (can be indexed) */
  inputs: (AbiParameter & { indexed?: boolean })[];

  /** Marks the event as anonymous (no signature in logs) */
  anonymous?: boolean;
}

/**
 * Defines a custom Solidity error.
 */
export interface AbiError {
  type: "error";

  /** Name of the error */
  name: string;

  /** List of input parameters */
  inputs: AbiParameter[];
}

/**
 * Defines the fallback function (called when no other function matches).
 */
export interface AbiFallback {
  type: "fallback";

  /** State mutability keyword */
  stateMutability: "nonpayable" | "payable";

  inputs?: never;
  outputs?: never;
}

/**
 * Defines the receive function (called when sending plain ETH).
 */
export interface AbiReceive {
  type: "receive";

  /** Must be payable */
  stateMutability: "payable";

  inputs?: never;
  outputs?: never;
}

/**
 * Union type representing any valid ABI item.
 */
export type AbiItem = AbiFunction | AbiConstructor | AbiEvent | AbiError | AbiFallback | AbiReceive;

/**
 * Represents a complete contract ABI definition.
 */
export type Abi = AbiItem[] | readonly AbiItem[];

/**
 * Represents common Solidity data types used in the Medusa protocol.
 * These types are primarily used for ABI parameter definitions and EIP-712 typed data signing.
 */
export type SolidityType =
  | "uint256"
  | "uint32"
  | "uint8"
  | "address"
  | "bool"
  | "bytes"
  | "bytes32"
  | "string"
  | "tuple"
  | "address[]"
  | "uint256[]"
  | "bytes32[]"
  | string;
