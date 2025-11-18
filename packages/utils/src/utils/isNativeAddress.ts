import { Address } from "../types";
import { NATIVE_ASSET_ADDRESS } from "../config";
import { isSameETHAddress } from "./isSameETHAddress";

export function isNativeAddress(address: string): address is Address {
  return isSameETHAddress(NATIVE_ASSET_ADDRESS, address);
}
