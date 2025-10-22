import type { UserConfig } from "../types";
import { ContractNotFoundError } from "./error";

export function getIntentBookContractAddress(config: Pick<UserConfig, "contract">) {
  const address = config.contract.intentBook;
  if (!address) {
    throw new ContractNotFoundError(
      `IntentBookContract address not found`, // TODO: Prompt to configure `IntentBookContract` in the configuration file
    );
  }
  return address;
}
