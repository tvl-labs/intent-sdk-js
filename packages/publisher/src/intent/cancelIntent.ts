import type { Address, Hex, UserConfig } from "@intents-sdk/utils";
import { bcs } from "@mysten/bcs";
import { toBytes } from "@intents-sdk/utils";
import { toU256Bytes } from "@intents-sdk/utils";
import { toHex } from "@intents-sdk/utils";
import { requestAccounts } from "@intents-sdk/utils";
import { getMedusaProvider } from "@intents-sdk/utils";

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
