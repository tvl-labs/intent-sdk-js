import type { Address, Hex, UserConfig } from "@arcadia-network/utils";
import { bcs } from "@mysten/bcs";
import { toBytes } from "@arcadia-network/utils";
import { toU256Bytes } from "@arcadia-network/utils";
import { toHex } from "@arcadia-network/utils";
import { requestAccounts } from "@arcadia-network/utils";
import { getMedusaProvider } from "@arcadia-network/utils";

export const CancelIntentPayload = bcs.struct("CancelIntentPayload", {
  intent_id: bcs.vector(bcs.u8(), { length: 32 } as any),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
});

export async function cancelIntent(config: Pick<UserConfig, "chainId" | "medusaURL" | "adapter">, intentId: Address) {
  const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const intentIdBytes = toBytes(intentId);
  const chainId = config.chainId;

  const addresses = await requestAccounts(config);
  const [address] = addresses;

  const bcsPayload = CancelIntentPayload.serialize({
    chain_id: chainId,
    intent_id: intentIdBytes,
    nonce: toU256Bytes(nonce),
  });

  const hexMessage = toHex(bcsPayload.toBytes());
  const signature = await config.adapter.request<Hex>({
    method: "personal_sign",
    params: [hexMessage, address],
  });

  const provider = getMedusaProvider(config);
  return provider.cancelIntent({
    payload: {
      chain_id: chainId,
      intent_id: intentId,
      nonce: nonce.toString(),
    },
    signature,
  });
}
