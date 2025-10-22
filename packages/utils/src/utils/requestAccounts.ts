import type { Address, UserConfig } from "../types";

export function requestAccounts(config: Pick<UserConfig, "adapter">) {
  return config.adapter.request<Address[]>({
    method: "eth_requestAccounts",
  });
}
