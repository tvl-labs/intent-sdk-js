export function parseUnits(value: string, decimals: number): bigint {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
  if (!/^\d*(\.\d*)?$/.test(value)) {
    throw new Error("Invalid decimal string");
  }

  const [integerPart, decimalPart = ""] = value.split(".");
  const decimalStr = (decimalPart + "0".repeat(decimals)).slice(0, decimals);

  const fullStr = integerPart + decimalStr;
  if (!/^\d+$/.test(fullStr)) {
    throw new Error("Invalid characters in value");
  }

  const resultStr = fullStr.replace(/^0+/, "") || "0";
  return BigInt(resultStr);
}
