import type {
  FastWithdrawalPermit,
  UserConfig,
  Hex,
  SolidityType,
  FastWithdrawalPermitWithWitnessTypedData,
} from "@arcadia-network/utils";

/**
 * Signs a `FastWithdrawalPermit` using EIP-712 structured data signing (eth_signTypedData_v4).
 *
 * @param adapter - The wallet adapter for signing operations. It must be able to sign on behalf of `permit.user`.
 * @param permit - The `FastWithdrawalPermit` object to be signed.
 *
 * @returns A Promise that resolves to the signature as a `Hex` string.
 */
export async function signFastWithdrawalPermit(
  config: Pick<UserConfig, "chainId" | "contract" | "adapter">,
  permit: FastWithdrawalPermit,
): Promise<Hex> {
  if (!config.contract.mTokenManager) {
    throw new Error("The mTokenManager contract address is not set");
  }

  const typedData = {
    types: {
      FastWithdrawalPermit: [
        { name: "nonce", type: "uint256" },
        { name: "spokeChainId", type: "uint32" },
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "user", type: "address" },
        { name: "caller", type: "address" },
      ],
    },
    domain: {
      name: "FastWithdrawalPermit",
      version: "1",
      chainId: config.chainId,
      verifyingContract: config.contract.mTokenManager,
    },
    primaryType: "FastWithdrawalPermit",
    message: permit,
  };

  return config.adapter.request<Hex>({
    method: "eth_signTypedData_v4",
    params: [permit.user, JSON.stringify(typedData)],
  });
}

export interface EIP712TypeDefinition {
  name: string;
  type: string;
}

export interface ExtraTypes {
  [key: string]: ReadonlyArray<EIP712TypeDefinition>;
}

/**
 * Returns a typed data object for a `FastWithdrawalPermit` with a witness.
 *
 * @param permit - The `FastWithdrawalPermit` object to be signed.
 * @param witnessType - The type of the witness data. Should be like `"Foo"`.
 * @param extraTypes - The extra types to be included in the typed data. Should be like `{ Foo: { name: "bar", type: "uint32" } }`
 * @param witness - The witness data to be included in the typed data. Should be like `{ bar: 3 }`
 *
 * @returns A typed data object for a `FastWithdrawalPermit` with a witness.
 */
export function getFastWithdrawalPermitWithWitnessTypedData(
  config: Pick<UserConfig, "chainId" | "contract">,
  permit: FastWithdrawalPermit,
  witnessType: SolidityType,
  extraTypes: ExtraTypes,
  witness: unknown,
): FastWithdrawalPermitWithWitnessTypedData {
  if (!config.contract.mTokenManager) {
    throw new Error("The mTokenManager contract address is not set");
  }

  return {
    types: {
      FastWithdrawalPermit: [
        { name: "nonce", type: "uint256" },
        { name: "spokeChainId", type: "uint32" },
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "user", type: "address" },
        { name: "caller", type: "address" },
        { name: "witness", type: witnessType },
      ],
      ...extraTypes,
    },
    domain: {
      name: "FastWithdrawalPermit",
      version: "1",
      chainId: config.chainId,
      verifyingContract: config.contract.mTokenManager,
    },
    primaryType: "FastWithdrawalPermit",
    message: { ...permit, witness },
  };
}
