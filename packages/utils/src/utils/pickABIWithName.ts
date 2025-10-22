import type { Abi } from "../types";

export function pickABIWithName(abi: Abi, ...names: string[]) {
  return abi.filter((item) => "name" in item && names.includes(item.name));
}
