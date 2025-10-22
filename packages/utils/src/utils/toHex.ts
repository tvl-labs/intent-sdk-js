import type { Hex } from "../types";

export function toHex(value: number | bigint | string | Uint8Array): Hex {
  if (value instanceof Uint8Array) {
    return ("0x" +
      Array.from(value)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")) as Hex;
  }

  if (typeof value === "string") {
    if (value.startsWith("0x") || value.startsWith("0X")) {
      return value.toLowerCase() as Hex;
    }
    value = BigInt(value);
  }
  if (typeof value === "number") {
    value = BigInt(value);
  }
  return `0x${(value as bigint).toString(16)}` as Hex;
}
