import type { MedusaIntent, UserConfig } from "@arcadia-network/utils";
import {
  getMTokenBalance,
  getSourceTokenByMToken,
  prepareDepositParamsByIntent,
  requestAccounts,
} from "@arcadia-network/utils";
import { depositMTokenGenerator, type DepositMTokenGeneratorOptions } from "../mtoken/depositMTokenGenerator";

export async function* prepareIntent(
  config: Pick<UserConfig, "adapter" | "contract" | "chains" | "chainId" | "medusaURL">,
  intent: MedusaIntent,
  options?: DepositMTokenGeneratorOptions,
) {
  const sourceToken = getSourceTokenByMToken(config, intent.srcMToken);
  const { mToken, amount } = prepareDepositParamsByIntent(config, intent);
  const addresses = await requestAccounts(config);
  const [address] = addresses;

  // Check if there are enough MToken balances
  const balance = await getMTokenBalance(config, mToken.address, address);
  if (balance < BigInt(intent.srcAmount)) {
    const depositGenerator = depositMTokenGenerator(config, sourceToken, amount, options);
    for await (const step of depositGenerator) {
      yield step;
    }
  }
}
