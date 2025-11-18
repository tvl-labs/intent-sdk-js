import type { Address, BaseToken, Hex, UserConfig } from "@intents-sdk/utils";
import {
  generateNonce,
  generatePermitDeadline,
  getAssetReservesContractAddress,
  requestAccounts,
} from "@intents-sdk/utils";
import type { PermitTransferFrom } from "./buildDepositPermit";
import { PERMIT2_ADDRESS } from "@intents-sdk/utils/config";

const TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  PermitWitnessTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "witness", type: "Payload" },
  ],
  Payload: [
    { name: "payload", type: "bytes" },
    { name: "gasLimit", type: "uint256" },
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

export interface BuildPermit2WithDepositOptions {
  nonce?: bigint;
  deadline?: bigint;
}

export interface BuildPermit2WithDepositResult {
  chainId: number;
  typedData: TypedData;
  permit: PermitTransferFrom;
  payload: Hex;
  gasLimit: bigint;
}

export async function buildDepositPermitWithPayload(
  config: Pick<UserConfig, "contract">,
  spoke: BaseToken,
  amount: bigint,
  payload: Hex,
  gasLimit: bigint,
  options?: BuildPermit2WithDepositOptions,
): Promise<BuildPermit2WithDepositResult> {
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
    primaryType: "PermitWitnessTransferFrom",
    domain: {
      name: "Permit2",
      chainId: spoke.chainId,
      verifyingContract: PERMIT2_ADDRESS,
    },
    message: {
      ...permit,
      spender,
      witness: {
        payload,
        gasLimit,
      },
    },
  };

  return {
    chainId: spoke.chainId,
    typedData,
    permit,
    payload,
    gasLimit,
  };
}
