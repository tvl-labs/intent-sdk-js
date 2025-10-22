import type { Address, BaseToken, Hex, UserConfig } from "@intents-sdk/utils";
import { depositERC20WithSignature } from "./depositERC20WithSignature";
import {
  addAndSwitchChain,
  getMTokenBalance,
  getMTokenBySourceToken,
  isApprovedERC20Permit2,
  requestAccounts,
  type TransactionReceipt,
  waitForMTokenBalanceUpdate,
  waitForTransactionReceiptWithChainId,
} from "@intents-sdk/utils";
import { buildDepositERC20Permit2 } from "./buildDepositERC20Permit2";
import { signTypeDataV4 } from "@intents-sdk/utils";
import { ensureERC20Permit2Approved } from "./ensureERC20Permit2Approved";
import { ensureERC20AllowanceToAssetReserves } from "./ensureERC20AllowanceToAssetReserves";
import { depositERC20Traditional } from "./depositERC20Traditional";

export type DepositStyle = "traditional" | "permit2";
type PickedConfig = Pick<UserConfig, "adapter" | "contract" | "medusaURL" | "chains" | "experimental" | "chainId">;

export interface DepositMTokenGeneratorOptions<STYLE extends DepositStyle = DepositStyle> {
  style?: STYLE;
  address?: Address;
  prepare?: boolean;
  waitBalanceUpdate?: boolean;
  waitDepositTxReceipt?: boolean;
}

export enum DepositMTokenGeneratorStep {
  Initial = "Initial",
  PrePare = "PrePare",
  Deposit = "Deposit",
  WaitTxReceipt = "WaitTxReceipt",
  WaitMTokenBalanceUpdate = "WaitMTokenBalanceUpdate",
}

export async function* depositMTokenGenerator<STYLE extends DepositStyle>(
  config: PickedConfig,
  spokeToken: BaseToken,
  amount: bigint,
  options?: DepositMTokenGeneratorOptions<STYLE>,
) {
  const style = options?.style ?? "permit2";
  const prepare = options?.prepare ?? true;
  const waitDepositTxReceipt = options?.waitDepositTxReceipt ?? true;
  const waitBalanceUpdate = options?.waitBalanceUpdate ?? true;

  let deposit: Deposit;
  switch (style) {
    case "traditional":
      deposit = new TraditionalDeposit(config, spokeToken, amount, options);
      break;
    case "permit2":
    default:
      deposit = new Permit2Deposit(config, spokeToken, amount, options);
      break;
  }
  yield { step: DepositMTokenGeneratorStep.Initial };

  if (prepare) {
    await deposit.prepare();
    yield { step: DepositMTokenGeneratorStep.PrePare };
  }
  const txHash = await deposit.run();
  yield { step: DepositMTokenGeneratorStep.Deposit, txHash };
  if (waitDepositTxReceipt) {
    const receipt = await deposit.wait();
    yield { step: DepositMTokenGeneratorStep.WaitTxReceipt, receipt };
  }
  if (waitBalanceUpdate) {
    await deposit.waitBalanceUpdate();
    yield { step: DepositMTokenGeneratorStep.WaitMTokenBalanceUpdate };
  }
  return deposit;
}

export abstract class Deposit {
  _address?: Address;
  _txHash?: Hex;
  _receipt?: TransactionReceipt;
  protected _beforeMTokenAmount?: bigint;

  get address() {
    return this._address;
  }

  get txHash() {
    return this._txHash;
  }

  get receipt() {
    return this._receipt;
  }

  constructor(
    readonly config: PickedConfig,
    readonly spokeToken: BaseToken,
    readonly amount: bigint,
    readonly options?: {
      address?: Address;
    },
  ) {
    this._address = options?.address;
  }

  protected async requestAccount() {
    if (this._address) return this._address;
    const [address] = await requestAccounts(this.config);
    this._address = address;
    return this._address;
  }

  protected async setBeforeAmount() {
    const { config, spokeToken } = this;
    const address = await this.requestAccount();
    const mTokenAddress = getMTokenBySourceToken(config, spokeToken).address;
    this._beforeMTokenAmount = await getMTokenBalance(config, mTokenAddress, address);
  }

  async waitBalanceUpdate(): Promise<void> {
    if (this._beforeMTokenAmount === undefined) {
      throw new Error("Please use `Deposit.run()`");
    }
    const { config, spokeToken, amount } = this;
    const address = await this.requestAccount();
    const beforeMTokenAmount = this._beforeMTokenAmount;
    await waitForMTokenBalanceUpdate(config, spokeToken, { greaterThanOrEqual: beforeMTokenAmount + amount }, address);
  }

  async wait(): Promise<TransactionReceipt> {
    if (!this._txHash) {
      throw new Error("Please use `Deposit.run()`");
    }
    const { config, spokeToken } = this;
    const receipt = await waitForTransactionReceiptWithChainId(config, spokeToken.chainId, this._txHash);
    this._receipt = receipt;
    return receipt;
  }

  abstract prepare(): Promise<void>;

  abstract run(): Promise<Hex>;
}

class Permit2Deposit extends Deposit {
  async prepare() {
    const { config, spokeToken, amount } = this;
    const address = await this.requestAccount();
    await addAndSwitchChain(config, spokeToken.chainId);
    if (!(await isApprovedERC20Permit2(config, spokeToken, address))) {
      await ensureERC20Permit2Approved(config, spokeToken, address, {
        expected: amount,
      });
    }
  }

  async run() {
    const { config, spokeToken, amount } = this;
    const address = await this.requestAccount();
    const permit2 = buildDepositERC20Permit2(config, spokeToken, amount, address);
    const signature = await signTypeDataV4(config, permit2.depositor, permit2.typedData);
    await this.setBeforeAmount();
    const txHash = await depositERC20WithSignature(this.config, this.spokeToken, this.amount, permit2, signature);
    this._txHash = txHash;
    return txHash;
  }
}

class TraditionalDeposit extends Deposit {
  async prepare() {
    const { config, spokeToken, amount } = this;
    const address = await this.requestAccount();
    await addAndSwitchChain(config, spokeToken.chainId);
    await ensureERC20AllowanceToAssetReserves(config, spokeToken, amount, address);
  }

  async run() {
    const { config, spokeToken, amount } = this;
    await this.setBeforeAmount();
    const txHash = await depositERC20Traditional(config, spokeToken, amount);
    this._txHash = txHash;
    return txHash;
  }
}
