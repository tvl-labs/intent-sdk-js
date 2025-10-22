import { IntentState, type MedusaIntent, type UserConfig } from "@arcadia-network/utils";
import {
  convertSourceTokenAmountToMTokenAmount,
  getMTokenBalance,
  getMTokenBySourceToken,
  prepareDepositParamsByIntent,
  waitForIntentStatus,
} from "@arcadia-network/utils";
import {
  depositMTokenGenerator,
  type DepositMTokenGeneratorOptions,
  DepositMTokenGeneratorStep,
} from "../mtoken/depositMTokenGenerator";
import { signIntent } from "../intent/signIntent";
import { proposeIntent } from "../intent/proposeIntent";

export enum BridgeSwapGeneratorStep {
  Initial = "Initial",
  Deposit = "Deposit",
  DepositPrepare = "DepositPrepare",
  DepositWaitBalanceUpdate = "DepositWaitBalanceUpdate",
  DepositWaitTxReceipt = "DepositWaitTxReceipt",
  SignIntent = "SignIntent",
  ProposeIntent = "ProposeIntent",
}

type PickedConfig = Pick<UserConfig, "adapter" | "contract" | "medusaURL" | "chains" | "experimental" | "chainId">;

export interface BridgeSwapGeneratorOptions {
  deposit?: DepositMTokenGeneratorOptions | false;
  waitIntentSolved?: boolean;
}

export async function* bridgeSwapGenerator(
  config: PickedConfig,
  intent: MedusaIntent,
  options?: BridgeSwapGeneratorOptions,
) {
  const waitIntentSolved = options?.waitIntentSolved ?? true;
  const deposit = options?.deposit;
  const { amount, spokeToken } = prepareDepositParamsByIntent(config, intent);
  yield { step: BridgeSwapGeneratorStep.Initial };
  const signature = await signIntent(config, intent.author, intent);
  yield { step: BridgeSwapGeneratorStep.SignIntent, signature };
  if (deposit !== false) {
    const mTokenAmount = convertSourceTokenAmountToMTokenAmount(config, spokeToken, amount);
    const balance = await getMTokenBalance(config, getMTokenBySourceToken(config, spokeToken).address, intent.author);
    if (balance <= mTokenAmount) {
      const depositGenerator = depositMTokenGenerator(config, spokeToken, amount, deposit);
      for await (const { step, ...value } of depositGenerator) {
        switch (step) {
          case DepositMTokenGeneratorStep.Deposit:
            yield { step: BridgeSwapGeneratorStep.DepositPrepare, ...value };
            break;
          case DepositMTokenGeneratorStep.WaitTxReceipt:
            yield { step: BridgeSwapGeneratorStep.DepositWaitTxReceipt, ...value };
            break;
          case DepositMTokenGeneratorStep.WaitMTokenBalanceUpdate:
            yield { step: BridgeSwapGeneratorStep.DepositWaitBalanceUpdate, ...value };
        }
      }
    }
  }
  const { txHash, intentId } = await proposeIntent(config, intent, signature);
  yield { step: BridgeSwapGeneratorStep.ProposeIntent, txHash, intentId };
  if (waitIntentSolved) {
    await waitForIntentStatus(config, intentId, IntentState.Solved);
  }
}
