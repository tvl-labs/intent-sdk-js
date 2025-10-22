import type { UserConfig } from "../types";
import { toHex } from "./toHex";
import { ChainNotFoundError } from "./error";

export async function addAndSwitchChain(config: Pick<UserConfig, "chains" | "adapter">, chainId: number) {
  const chain = config.chains.find((x) => x.chainId === toHex(chainId));
  if (!chain) throw new ChainNotFoundError();

  try {
    await config.adapter.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(chainId) }],
    });
  } catch (err: unknown) {
    if (isDefinedError(err) && (err?.code === 4902 || /not found|unrecognized|missing/i.test(err?.message ?? ""))) {
      await config.adapter.request({
        method: "wallet_addEthereumChain",
        params: [chain],
      });
      await config.adapter.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(chainId) }],
      });
    } else {
      throw err;
    }
  }
}

function isDefinedError(error: unknown): error is { code?: number; message?: string } {
  return (
    !!error &&
    typeof error === "object" &&
    (("code" in error && typeof error.code === "number") || ("message" in error && typeof error.message === "string"))
  );
}
