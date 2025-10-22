import type { Hex } from "../types";
import { toHex } from "./toHex";

export function randomHex(bytes: number = 32): Hex {
  const cryptoAPI = globalThis.crypto || require("crypto").webcrypto;

  const buffer = new Uint8Array(bytes);
  cryptoAPI.getRandomValues(buffer);

  return toHex(buffer);
}
