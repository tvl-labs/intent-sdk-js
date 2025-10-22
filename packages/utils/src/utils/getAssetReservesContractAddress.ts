import { ContractNotFoundError } from "./error";
import type { UserConfig } from "../types";
import { toHex } from "./toHex";

export function getAssetReservesContractAddress(config: Pick<UserConfig, "contract">, chainId: number) {
  const sourceHexChainId = toHex(chainId);
  const assetReservesContractAddress = config.contract.assetReserves?.[sourceHexChainId];
  if (!assetReservesContractAddress) {
    throw new ContractNotFoundError(
      `AssetReserves address not found for chain ${chainId} (${sourceHexChainId})`, // TODO: Prompt to configure `AssetReservesContract` in the configuration file
    );
  }
  return assetReservesContractAddress;
}
