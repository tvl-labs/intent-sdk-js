/**
 * Convert an integer amount (bigint) between different decimal precisions.
 *
 * - If converting from higher precision to lower precision (e.g., 18 -> 6),
 *   the result is truncated (fractional detail is lost).
 * - If converting from lower precision to higher precision (e.g., 6 -> 18),
 *   the result is scaled up by appending zeros.
 *
 * Examples:
 * - convertUnits(1234567890000000000n, 18, 6) => 1234567890n
 * - convertUnits(1234567n, 6, 18) => 1234567000000000000n
 * - convertUnits(-1n, 18, 6) => 0n (truncation towards zero)
 */
export function convertUnits(value: bigint, fromDecimals: number, toDecimals: number): bigint {
  if (!Number.isInteger(fromDecimals) || fromDecimals < 0) {
    throw new Error(`fromDecimals must be a non-negative integer, received: ${fromDecimals}`);
  }
  if (!Number.isInteger(toDecimals) || toDecimals < 0) {
    throw new Error(`toDecimals must be a non-negative integer, received: ${toDecimals}`);
  }
  if (value === 0n || fromDecimals === toDecimals) return value;

  const diff = toDecimals - fromDecimals;

  // Scaling factor as a power of 10
  const factor = 10n ** BigInt(Math.abs(diff));

  if (diff > 0) {
    // Scale up (append zeros)
    return value * factor;
  } else {
    // Scale down (truncate towards zero)
    return value / factor;
  }
}
