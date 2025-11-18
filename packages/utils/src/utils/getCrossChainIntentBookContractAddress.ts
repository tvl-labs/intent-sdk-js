import type { UserConfig } from "../types";
import { ContractNotFoundError } from "./error";

export function getCrossChainIntentBookContractAddress(config: Pick<UserConfig, "contract">) {
  const address = config.contract.crossChainIntentBook;
  if (!address) {
    throw new ContractNotFoundError(
      `CrossChainIntentBookContract address not found`, // TODO: Prompt to configure `CrossChainIntentBookContract` in the configuration file
    );
  }
  return address;
}
