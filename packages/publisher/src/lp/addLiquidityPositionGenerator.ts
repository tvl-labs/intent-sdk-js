import { type BaseToken, IntentState, type UserConfig } from "@intents-sdk/utils";
import { buildLiquidityPositionIntent, type BuildLiquidityPositionIntentOptions } from "./buildLiquidityPositionIntent";
import {
  convertSourceTokenAmountToMTokenAmount,
  getMTokenBalance,
  getMTokenBySourceToken,
  requestAccounts,
  waitForIntentStatus,
} from "@intents-sdk/utils";
import {
  checkMTokenExists,
  depositMTokenGenerator,
  type DepositMTokenGeneratorOptions,
  DepositMTokenGeneratorStep,
} from "../mtoken";
import { proposeIntent, signIntent } from "../intent";

/**
 * Optional settings for customizing the `addLiquidityPositions` operation.
 */
export interface AddLiquidityPositionsOptions extends BuildLiquidityPositionIntentOptions {
  deposit?: DepositMTokenGeneratorOptions | false;
  waitIntentReady?: boolean;
}

export enum AddLiquidityPositionGeneratorStep {
  Initial = "Initial",
  RequestAccounts = "RequestAccounts",
  SignIntent = "SignIntent",
  Deposit = "Deposit",
  DepositPrepare = "DepositPrepare",
  DepositWaitBalanceUpdate = "DepositWaitBalanceUpdate",
  DepositWaitTxReceipt = "DepositWaitTxReceipt",
  ProposeIntent = "ProposeIntent",
}

export async function* addLiquidityPositionGenerator(
  config: Pick<UserConfig, "adapter" | "contract" | "chains" | "chainId" | "medusaURL">,
  sourceToken: BaseToken,
  destinationTokens: BaseToken[],
  amount: bigint,
  options?: AddLiquidityPositionsOptions,
) {
  const waitIntentReady = options?.waitIntentReady ?? true;
  const deposit = options?.deposit;

  checkMTokenExists(config, sourceToken);
  for (const destinationToken of destinationTokens) {
    checkMTokenExists(config, destinationToken);
  }
  yield { step: AddLiquidityPositionGeneratorStep.Initial } as const;

  const addresses = await requestAccounts(config);
  const [address] = addresses;

  yield { step: AddLiquidityPositionGeneratorStep.RequestAccounts, addresses, address } as const;

  const intent = buildLiquidityPositionIntent(config, sourceToken, destinationTokens, amount, address, options);
  const signature = await signIntent(config, address, intent);
  yield { step: AddLiquidityPositionGeneratorStep.SignIntent, signature };

  if (deposit !== false) {
    const mTokenAmount = convertSourceTokenAmountToMTokenAmount(config, sourceToken, amount);
    const balance = await getMTokenBalance(config, getMTokenBySourceToken(config, sourceToken).address, address);
    if (balance <= mTokenAmount) {
      const depositGenerator = depositMTokenGenerator(config, sourceToken, amount, deposit);
      for await (const { step, ...value } of depositGenerator) {
        switch (step) {
          case DepositMTokenGeneratorStep.Deposit:
            yield { step: AddLiquidityPositionGeneratorStep.DepositPrepare, ...value };
            break;
          case DepositMTokenGeneratorStep.WaitTxReceipt:
            yield { step: AddLiquidityPositionGeneratorStep.DepositWaitTxReceipt, ...value };
            break;
          case DepositMTokenGeneratorStep.WaitMTokenBalanceUpdate:
            yield { step: AddLiquidityPositionGeneratorStep.DepositWaitBalanceUpdate, ...value };
        }
      }
    }
  }

  const { txHash, intentId } = await proposeIntent(config, intent, signature);
  yield { step: AddLiquidityPositionGeneratorStep.ProposeIntent, txHash, intentId };
  if (waitIntentReady) {
    await waitForIntentStatus(config, intentId, IntentState.Open);
  }
}
