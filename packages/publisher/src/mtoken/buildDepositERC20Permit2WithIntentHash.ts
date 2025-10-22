import type { Address, BaseToken, Hex, UserConfig } from "@intents-sdk/utils";
import {
  generateNonce,
  generatePermitDeadline,
  getAssetReservesContractAddress,
  requestAccounts,
} from "@intents-sdk/utils";
import { PERMIT2_ADDRESS } from "@intents-sdk/utils/config";

interface EIP712Types {
  EIP712Domain?: ReadonlyArray<
    | { name: "name"; type: "string" }
    | { name: "version"; type: "string" }
    | { name: "chainId"; type: "uint256" }
    | { name: "verifyingContract"; type: "address" }
  >;
  PermitTransferFrom: ReadonlyArray<
    | { name: "permitted"; type: "TokenPermissions" }
    | { name: "spender"; type: "address" }
    | { name: "nonce"; type: "uint256" }
    | { name: "deadline"; type: "uint256" }
  >;
  TokenPermissions: ReadonlyArray<{ name: "token"; type: "address" } | { name: "amount"; type: "uint256" }>;
}

interface EIP712TypesWithWitness extends EIP712Types {
  PermitWitnessTransferFrom: ReadonlyArray<
    | { name: "permitted"; type: "TokenPermissions" }
    | { name: "spender"; type: "address" }
    | { name: "nonce"; type: "uint256" }
    | { name: "deadline"; type: "uint256" }
    | { name: "witness"; type: "bytes32" }
  >;
}

interface TypedData {
  types: EIP712Types | EIP712TypesWithWitness;
  primaryType: string;
  domain: {
    name: string;
    version?: string;
    chainId: number;
    verifyingContract: Address;
  };
  message: Record<string, unknown>;
}

export interface BuildPermit2WithDepositOptions {
  nonce?: bigint;
  deadline?: bigint;
  ignoreDomain?: boolean;
}

export interface BuildPermit2WithDepositResult {
  typedData: TypedData;
  domain: {
    name: string;
    version?: string;
    chainId: number;
    verifyingContract: Address;
  };
  spender: Address;
  deadline: bigint;
  nonce: bigint;
  depositor: Address;
  witness: Hex;
}

export async function buildDepositERC20Permit2WithIntentHash(
  config: Pick<UserConfig, "adapter" | "chainId" | "experimental" | "contract">,
  spoke: BaseToken,
  amount: bigint,
  intentHash: Hex,
  options?: BuildPermit2WithDepositOptions,
): Promise<BuildPermit2WithDepositResult> {
  const ignoreDomain = options?.ignoreDomain ?? config.experimental?.ignoreSignIntentDomain ?? false;
  const spender = getAssetReservesContractAddress(config, spoke.chainId);
  const [address] = await requestAccounts(config);

  const nonce = options?.nonce ?? generateNonce();

  const deadline = options?.deadline ?? generatePermitDeadline();

  const types: EIP712Types | EIP712TypesWithWitness = {
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
    PermitWitnessTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "witness", type: "bytes32" },
    ],
    ...(!ignoreDomain
      ? {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
        }
      : {}),
  };

  const typedData: TypedData = {
    types,
    primaryType: "PermitWitnessTransferFrom",
    domain: {
      name: "Permit2",
      chainId: spoke.chainId,
      verifyingContract: PERMIT2_ADDRESS,
    },
    message: {
      permitted: {
        token: spoke.address,
        amount: amount.toString(),
      },
      spender,
      nonce: nonce.toString(),
      deadline: deadline.toString(),
      witness: intentHash,
    },
  };

  return {
    typedData,
    domain: typedData.domain,
    spender,
    deadline,
    witness: intentHash,
    nonce,
    depositor: address,
  };
}
