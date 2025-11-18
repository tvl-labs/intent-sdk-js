import type { Address, Hex, Signature } from "./utils";
import type { SolidityType } from "./abi";

type IntentId = Hex;
type TxHash = Hex;

/**
 * Defines how much of the requested outcome must be fulfilled.
 */
export enum FillStructureStr {
  /**
   * The exact amounts in `mAmounts` must be fulfilled; no more, no less.
   */
  Exact = "Exact",

  /**
   * At least the amounts in `mAmounts` must be fulfilled; more is acceptable.
   */
  Minimum = "Minimum",

  /**
   * A percentage-based fill; the final amounts must meet the proportional expectation.
   */
  PercentageFilled = "PercentageFilled",

  /**
   * A custom-defined range of acceptable fill outcomes.
   */
  ConcreteRange = "ConcreteRange",
}

export enum FillStructure {
  /**
   * The exact amounts in `mAmounts` must be fulfilled; no more, no less.
   */
  Exact = 0,

  /**
   * At least the amounts in `mAmounts` must be fulfilled; more is acceptable.
   */
  Minimum = 1,

  /**
   * A percentage-based fill; the final amounts must meet the proportional expectation.
   */
  PercentageFilled = 2,

  /**
   * A custom-defined range of acceptable fill outcomes.
   */
  ConcreteRange = 3,
}

/**
 * Defines the required structure for the assets in the outcome.
 */
export enum OutcomeAssetStructureStr {
  /**
   * Any one token from the list is acceptable as the outcome.
   */
  AnySingle = "AnySingle",

  /**
   * Any subset of tokens from the list is acceptable.
   */
  Any = "Any",

  /**
   * All tokens and their corresponding amounts must be fulfilled.
   */
  All = "All",
}

export enum OutcomeAssetStructure {
  AnySingle = 0,
  Any = 1,
  All = 2,
}

export const FillStructureStringToEnum: Record<FillStructureStr, FillStructure> = {
  [FillStructureStr.Exact]: FillStructure.Exact,
  [FillStructureStr.Minimum]: FillStructure.Minimum,
  [FillStructureStr.PercentageFilled]: FillStructure.PercentageFilled,
  [FillStructureStr.ConcreteRange]: FillStructure.ConcreteRange,
};

export const FillStructureEnumToString: Record<FillStructure, FillStructureStr> = {
  [FillStructure.Exact]: FillStructureStr.Exact,
  [FillStructure.Minimum]: FillStructureStr.Minimum,
  [FillStructure.PercentageFilled]: FillStructureStr.PercentageFilled,
  [FillStructure.ConcreteRange]: FillStructureStr.ConcreteRange,
};

export const OutcomeAssetStructureStringToEnum: Record<OutcomeAssetStructureStr, OutcomeAssetStructure> = {
  [OutcomeAssetStructureStr.AnySingle]: OutcomeAssetStructure.AnySingle,
  [OutcomeAssetStructureStr.Any]: OutcomeAssetStructure.Any,
  [OutcomeAssetStructureStr.All]: OutcomeAssetStructure.All,
};

export const OutcomeAssetStructureEnumToString: Record<OutcomeAssetStructure, OutcomeAssetStructureStr> = {
  [OutcomeAssetStructure.AnySingle]: OutcomeAssetStructureStr.AnySingle,
  [OutcomeAssetStructure.Any]: OutcomeAssetStructureStr.Any,
  [OutcomeAssetStructure.All]: OutcomeAssetStructureStr.All,
};

export interface MedusaTransaction {
  publish_timestamp: number | null;
  publish_tx_hash: string | null;
  solve_timestamp: number | null;
  solve_tx_hash: string | null;
  redeem_timestamp: number | null;
  redeem_tx_hash: string | null;
  withdraw_timestamp: number | null;
  withdraw_to_spoke_timestamp: number | null;
  withdraw_tx_hash: string | null;
  cancel_timestamp: number | null;
  cancel_tx_hash: string | null;
  remaining_intent_id: number | null;
  error_timestamp: number;
  error_tx_hash: string;
  error_type: IntentErrorType | null;
}

export enum IntentErrorType {
  Publish = "Publish",
  Solve = "Solve",
  Cancel = "Cancel",
  Redeem = "Redeem",
  Withdraw = "Withdraw",
}

/**
 * Represents the expected result of a Medusa intent execution.
 *
 * @template F - The strategy used for fulfilling the intent (fill structure).
 * @template O - The expected structure of the resulting outcome assets.
 */
export interface MedusaIntentOutcome<
  F extends FillStructure | FillStructureStr = FillStructureStr,
  O extends OutcomeAssetStructure | OutcomeAssetStructureStr = OutcomeAssetStructureStr,
> {
  /**
   * List of destination mToken addresses expected in the outcome.
   */
  mTokens: Address[];

  /**
   * Corresponding amounts for each mToken, as stringified integers (in base units).
   * The interpretation of these values depends on the `fillStructure` strategy.
   */
  mAmounts: string[];

  /**
   * Strategy describing how the assets in `mTokens` should be structured in the outcome.
   */
  outcomeAssetStructure: O;

  /**
   * Strategy describing how the fulfillment of the intent should be validated.
   */
  fillStructure: F;
}

export interface MedusaIntent<
  F extends FillStructure | FillStructureStr = FillStructureStr,
  O extends OutcomeAssetStructure | OutcomeAssetStructureStr = OutcomeAssetStructureStr,
> {
  /**
   * Address of the user who created the intent.
   */
  author: Address;

  /**
   * The latest timestamp (in seconds) at which this intent remains valid.
   * Equivalent to TTL (time-to-live). After this time, the intent is considered expired.
   */
  validBefore: string;

  /**
   * (Optional) The earliest timestamp (in seconds) before which this intent is invalid.
   * If specified, the intent cannot be executed before this time.
   */
  validAfter: string;

  /**
   * A unique identifier to prevent replay and ensure correct ordering of intents.
   * Should be unique per author.
   */
  nonce: string;

  /**
   * Amount of the source mToken to be used, as a stringified integer (in base units).
   */
  srcMToken: Address;

  /**
   * Amount of the source mToken to be used, as a stringified integer (in base units).
   */
  srcAmount: string;

  /**
   * Expected outcome of the intent, including destination chain/token, receiver, and amount.
   */
  outcome: MedusaIntentOutcome<F, O>;
}

export interface MedusaCrossChainIntent {
  author: Address;
  // uint256
  validBefore: Hex;
  // uint256
  nonce: Hex;
  srcMToken: Address;
  // uint256
  srcAmount: Hex;
  // uint32
  destinationChainId: number;
  // uint256
  nativeOutcome: Hex;
  outcomeToken: Address;
  // uint256
  outcomeAmount: Hex;
}

export type MedusaHistory = [MedusaTransaction, MedusaIntent];

export interface RefineResult {
  Refinement: MedusaIntent;
}

export interface RefineResultStatus {
  RefinementNotFound: "RefinementNotFound";
}

export type QueryRefinementResult = RefineResult | RefineResultStatus;

export enum IntentState {
  NonExistent = "NonExistent",
  Open = "Open",
  Locked = "Locked",
  Solved = "Solved",
  Settled = "Settled",
  Expired = "Expired",
  Cancelled = "Cancelled",
  Error = "Error",
}

export const INVALID_STATE = [
  IntentState.Expired,
  IntentState.Cancelled,
  IntentState.NonExistent,
  IntentState.Error,
] as const;
export type InvalidState = (typeof INVALID_STATE)[number];

export interface FastWithdrawalPermit {
  // uint256, should be random with maybe bitmap gas optimization.
  nonce: Hex;
  // uint32
  spokeChainId: number;
  token: Address;
  // uint256, in 18 decimals
  amount: Hex;
  user: Address;
  caller: Address;
}

/**
 * Represents a typed data object for a FastWithdrawalPermit with witness data,
 * following EIP-712 structured data signing format.
 */
export interface FastWithdrawalPermitWithWitnessTypedData {
  /**
   * Type definitions for all structs used in the message.
   */
  types: {
    /**
     * The main FastWithdrawalPermit struct type definition.
     */
    FastWithdrawalPermit: Array<{ name: string; type: SolidityType }>;
    /**
     * Additional type definitions for any nested structs in the witness data.
     */
    [key: string]: Array<{ name: string; type: SolidityType }>;
  };

  /**
   * EIP-712 domain separator data.
   */
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  };

  /**
   * The primary type of the message (usually "FastWithdrawalPermit").
   */
  primaryType: string;

  /**
   * The message data containing the FastWithdrawalPermit and witness data.
   */
  message: FastWithdrawalPermit & Record<string, unknown>;
}

/**
 *
 */
export interface MedusaProvider {
  /**
   * Fetches the intent for a given intent ID.
   *
   * @param tellerAddress - The teller address to deposit to.
   * @param depositorAddress - The depositor address to deposit from.
   * @param asset - The asset to deposit.
   * @param amount - The amount to deposit.
   * @param minShares - The minimum number of shares expected from the deposit.
   * @returns A Promise that resolves to the tx hash of the deposit.
   */
  depositToVault: (params: {
    payload: {
      nonce: string;
      tellerAddress: Address;
      depositorAddress: Address;
      asset: Address;
      amount: string;
      minShares: string;
    };
    signature: Signature;
  }) => Promise<TxHash>;

  /**
   * Fetches the intent for a given intent ID.
   *
   * @param tellerAddress - The teller address to withdraw from.
   * @param shares - The number of shares to burn for the withdrawal.
   * @param depositorAddress - The depositor address to withdraw to.
   * @param asset - The asset to withdraw.
   * @param minAmount - The minimum amount of asset to receive.
   * @param feePercentage - The fee percentage to pay to the vault.
   * @returns A Promise that resolves to the tx hash of the withdrawal.
   */
  withdrawFromVault: (params: {
    payload: {
      nonce: string;
      tellerAddress: Address;
      depositorAddress: Address;
      shares: string;
      asset: Address;
      minAmount: string;
      feePercentage: number;
    };
    signature: Signature;
  }) => Promise<TxHash>;

  /**
   * Fetches the intent for a given intent ID.
   *
   * @param tellerAddress - The teller address to preview the deposit for.
   * @param asset - The asset to deposit.
   * @param amount - The amount to deposit.
   * @returns A Promise that resolves to a hexadecimal string representing the number of shares expected from the deposit.
   */
  previewDepositToVault: (tellerAddress: Address, asset: Address, amount: string) => Promise<Hex>;

  /**
   * Fetches the intent for a given intent ID.
   *
   * @param tellerAddress - The teller address to preview the withdrawal for.
   * @param asset - The asset to withdraw.
   * @param shares - The number of shares to burn for the withdrawal.
   * @param feePercentage - The fee percentage to pay to the vault.
   * @returns A Promise that resolves to a hexadecimal string representing the amount of asset expected from the withdrawal.
   */
  previewMaximumWithdrawFromVault: (
    tellerAddress: Address,
    asset: Address,
    shares: string,
    feePercentage: number,
  ) => Promise<Hex>;

  /**
   * Fetches the intent for a given intent ID.
   *
   * @param intentId - The intent ID to fetch.
   * @returns A Promise that resolves to the intent.
   */
  getIntent: (intentId: Address) => Promise<MedusaIntent | null>;

  /**
   * Fetches all intent IDs created by a specific author address.
   *
   * @param author - The address of the intent creator.
   * @returns A Promise that resolves to a list of intent IDs (addresses).
   */
  getIntentIdsByAuthor: (author: Address) => Promise<Address[]>;

  /**
   * Retrieves the full lifecycle history of an intent, including refinement,
   * fill events, and final state.
   *
   * @param intentId - The ID of the intent to query.
   * @returns A Promise that resolves to the `MedusaHistory` object.
   */
  getHistory: (intentId: Address) => Promise<MedusaHistory>;

  /**
   * Requests to withdraw mTokens associated with a finalized intent.
   * Requires a signed payload from the intent owner.
   *
   * @param params.payload - Includes chain ID, recipient address, mToken address, amount, and nonce.
   * @param params.signature - The signature from the user (EIP-712 format).
   * @returns A Promise that resolves to the address where the tokens were withdrawn.
   */
  withdrawMtokens: (params: {
    payload: {
      address: Address;
      mtoken: Address;
      amount: string;
      nonce: string;
    };
    signature: Signature;
  }) => Promise<{ result: Address }>;

  fastWithdrawMToken: (permit: FastWithdrawalPermit, userSignature: Hex) => Promise<[Hex, Hex]>;

  /**
   * Requests fast withdrawal of mTokens using a signed permit with witness data.
   * Requires a signed payload from the user including witness information.
   *
   * @param permitAndWitnessTypedData - The typed data object containing the FastWithdrawalPermit and witness information.
   * @param userSignature - The user's signature for the typed data.
   * @returns A Promise that resolves to a tuple containing the transaction hash and result address.
   */
  fastWithdrawMTokenWithWitness: (
    permitAndWitnessTypedData: FastWithdrawalPermitWithWitnessTypedData,
    userSignature: Hex,
  ) => Promise<[Hex, Hex]>;

  /**
   * Cancels an active or pending intent. Requires the user's signed payload.
   *
   * @param params.payload - Includes chain ID, intent ID, and nonce.
   * @param params.signature - The signature authorizing cancellation.
   * @returns A Promise that resolves to the address where cancellation was confirmed.
   */
  cancelIntent: (params: {
    payload: {
      intentId: IntentId;
      nonce: string;
    };
    signature: Signature;
  }) => Promise<{ result: Address }>;

  /**
   * Requests the Medusa backend to compute a refinement for the given intent.
   * This simulates or resolves the best matching swap/output path for preview purposes.
   *
   * @param intent - The full `MedusaIntent` object.
   * @returns A Promise that resolves to a refinement ID (address).
   */
  createRefinement: (intent: MedusaIntent) => Promise<Address>;

  /**
   * Queries the refinement result by intent ID.
   *
   * @param intentId - The ID of the intent whose refinement is being queried.
   * @returns A Promise resolving to the detailed refinement result or `RefinementNotFound` if not yet available.
   */
  queryRefinement: (intentId: Address) => Promise<QueryRefinementResult>;

  /**
   * Submits an intent to the Medusa backend for publication and propagation.
   *
   * @param params.intent - The complete `MedusaIntent` to propose.
   * @param params.signature - Signature authorizing the proposal.
   * @returns A Promise resolving to a tuple of [transaction hash, intent ID].
   */
  proposeIntent: (params: { intent: MedusaIntent; signature: Signature }) => Promise<[TxHash, IntentId]>;

  /**
   * Publishes a cross-chain intent to the Medusa backend for publication and propagation.
   *
   * @param params.intent - The complete `MedusaCrossChainIntent` to propose.
   * @param params.signature - Signature authorizing the proposal.
   * @returns A Promise resolving to a tuple of [transaction hash, intent ID].
   */
  publishCrossChainIntent: (intent: MedusaCrossChainIntent, signature: Signature) => Promise<TxHash>;

  /**
   * Retrieves the current execution status/state of the given intent.
   *
   * @param intentId - The intent ID to check.
   * @returns A Promise that resolves to an `IntentState` (e.g., Pending, Filled, Cancelled).
   */
  getIntentStatus: (intentId: Address) => Promise<IntentState>;

  /**
   * Retrieves the MToken balance for a specific user address.
   *
   * @param userAddress - The user's address to query the balance for.
   * @param mTokenAddress - The address of the MToken contract.
   * @returns A Promise that resolves to the hexadecimal string representation of the user's MToken balance.
   */
  getMtokenBalanceByAuthor: (userAddress: Address, mTokenAddress: Address) => Promise<Hex>;

  /**
   * Get total vault shares
   * @param tellerAddress - The teller address to query.
   */
  getVaultTotalShares: (tellerAddress: Address) => Promise<Hex>;

  /**
   * Get vault total asset value
   * @param tellerAddress - The teller address to query.
   */
  getVaultTotalAssetValue: (tellerAddress: Address) => Promise<Hex>;

  /**
   * Get depositor vault shares
   * @param tellerAddress - The teller address to query.
   * @param depositorAddress - The depositor address to query.
   */
  getDepositorVaultShares: (tellerAddress: Address, depositorAddress: Address) => Promise<Hex>;
}
