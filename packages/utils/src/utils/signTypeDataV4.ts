import type { Address, Hex, UserConfig } from "../types";

export async function signTypeDataV4<T extends object>(
  config: Pick<UserConfig, "adapter">,
  address: Address,
  typedData: T,
) {
  return config.adapter.request<Hex>({
    method: "eth_signTypedData_v4",
    params: [address, JSON.stringify(typedData, (_, v) => (typeof v === "bigint" ? v.toString() : v))],
  });
}
