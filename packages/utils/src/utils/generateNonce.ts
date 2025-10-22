let counter = 0;

export function generateNonce(): bigint {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 1e6);
  counter = (counter + 1) % 1e6;

  const nonceStr = `${timestamp}${rand}${counter}`;
  return BigInt(nonceStr);
}
