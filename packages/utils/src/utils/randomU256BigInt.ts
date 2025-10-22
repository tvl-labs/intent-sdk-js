export function randomU256BigInt(): bigint {
  const cryptoAPI = globalThis.crypto || require("crypto").webcrypto;
  const bytes = cryptoAPI.getRandomValues(new Uint8Array(32));

  let result = 0n;
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) | BigInt(bytes[i]);
  }

  return result;
}
