import type { Address, BaseToken, UserConfig } from "@intents-sdk/utils";
import { generateNonce, generatePermitDeadline, getAssetReservesContractAddress } from "@intents-sdk/utils";
import { PERMIT2_ADDRESS } from "@intents-sdk/utils/config";

const TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  PermitTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" },
  ],
} as const;

interface TypedData {
  types: typeof TYPES;
  primaryType: string;
  domain: {
    name: string;
    chainId: number;
    verifyingContract: Address;
  };
  message: Record<string, unknown>;
}

export interface BuildPermit2Options {
  nonce?: bigint;
  deadline?: bigint;
}

export interface TokenPermissions {
  token: Address;
  amount: bigint;
}

export interface PermitTransferFrom {
  permitted: TokenPermissions;
  nonce: bigint;
  deadline: bigint;
}

export interface BuildPermit2Result {
  chainId: number;
  typedData: TypedData;
  permit: PermitTransferFrom;
}

export function buildDepositPermit(
  config: Pick<UserConfig, "adapter" | "contract">,
  spoke: BaseToken,
  amount: bigint,
  options?: BuildPermit2Options,
): BuildPermit2Result {
  const spender = getAssetReservesContractAddress(config, spoke.chainId);
  const nonce = options?.nonce ?? generateNonce();
  const deadline = options?.deadline ?? generatePermitDeadline();

  const permit: PermitTransferFrom = {
    permitted: {
      token: spoke.address,
      amount: amount,
    },
    nonce,
    deadline,
  };

  const typedData: TypedData = {
    types: TYPES,
    primaryType: "PermitTransferFrom",
    domain: {
      name: "Permit2",
      chainId: spoke.chainId,
      verifyingContract: PERMIT2_ADDRESS,
    },
    message: {
      ...permit,
      spender,
    },
  };

  return {
    chainId: spoke.chainId,
    typedData,
    permit,
  };
}
