import type { Hex } from "../types";

export function toBytes(value: string | bigint | number | boolean | Hex, opts: { size?: number } = {}): Uint8Array {
  let bytes: Uint8Array;

  // boolean
  if (typeof value === "boolean") {
    bytes = new Uint8Array([value ? 1 : 0]);
  }
  // number or bigint
  else if (typeof value === "number" || typeof value === "bigint") {
    let hex = BigInt(value).toString(16);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    bytes = Uint8Array.from(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  }
  // hex string
  else if (typeof value === "string" && /^0x[0-9a-fA-F]+$/.test(value)) {
    let hex = value.slice(2);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    bytes = Uint8Array.from(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  }
  // plain string
  else if (typeof value === "string") {
    bytes = new TextEncoder().encode(value);
  }
  // Hex type (if different from string)
  else if (typeof value === "object" && value !== null && "toString" in value) {
    let hex = `${value}`;
    if (hex.startsWith("0x")) hex = hex.slice(2);
    if (hex.length % 2 !== 0) hex = "0" + hex;
    bytes = Uint8Array.from(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  } else {
    throw new Error("Unsupported type for toBytes");
  }

  // handle size option
  if (opts.size !== undefined) {
    if (bytes.length > opts.size) {
      // truncate
      bytes = bytes.slice(bytes.length - opts.size);
    } else if (bytes.length < opts.size) {
      // pad left with 0
      const padded = new Uint8Array(opts.size);
      padded.set(bytes, opts.size - bytes.length);
      bytes = padded;
    }
  }

  return bytes;
}
