/**
 * Generate a permit deadline timestamp
 * @param durationInSeconds - Duration in seconds from now (default: 1 hour)
 * @returns Permit deadline as bigint timestamp
 */
export function generatePermitDeadline(durationInSeconds: number = 3600): bigint {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  return BigInt(now + durationInSeconds);
}
