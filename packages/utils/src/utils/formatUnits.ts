/**
 * Format an integer amount (bigint) in base units into a decimal string
 * (similar to viem's formatUnits).
 *
 * Examples:
 * - formatUnits(123456789n, 6) => "123.456789"
 * - formatUnits(1000000000000000000n, 18) => "1"
 * - formatUnits(-1n, 18) => "-0.000000000000000001"
 *
 * Notes:
 * - The default decimals is 18.
 * - Only supports integer input (bigint). To parse from string/decimal to base units,
 *   use a parseUnits-style function.
 */
export function formatUnits(value: bigint, decimals: number = 18): string {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error(`decimals must be a non-negative integer, received: ${decimals}`);
  }

  // Fast path for zero
  if (value === 0n) return "0";

  const sign = value < 0n ? "-" : "";
  let abs = value < 0n ? -value : value;

  if (decimals === 0) {
    return sign + abs.toString();
  }

  const base = 10n ** BigInt(decimals);
  const integer = abs / base;
  const fraction = abs % base;

  const integerStr = integer.toString();
  if (fraction === 0n) {
    // No fractional part
    return sign + integerStr;
  }

  // Left-pad the fractional part to `decimals` digits
  let fractionStr = fraction.toString().padStart(decimals, "0");

  // Trim trailing zeros in the fractional part
  let i = fractionStr.length - 1;
  while (i >= 0 && fractionStr[i] === "0") i--;
  fractionStr = i >= 0 ? fractionStr.slice(0, i + 1) : "";

  // If fractional part becomes empty, return integer only
  if (fractionStr.length === 0) {
    return sign + integerStr;
  }

  // Ensure a leading zero for cases like 0.001
  const head = integerStr.length ? integerStr : "0";
  return sign + head + "." + fractionStr;
}

export default formatUnits;
