import { bcs } from "@mysten/bcs";
import { requestAccounts, toBytes, toU256Bytes, toHex, getMedusaProvider } from "@intents-sdk/utils";
import type { Address, Hex, UserConfig } from "@intents-sdk/utils";

export const WithdrawMtokensPayload = bcs.struct("WithdrawMtokensPayload", {
  address: bcs.vector(bcs.u8(), { length: 20 } as any),
  amount: bcs.vector(bcs.u8(), { length: 32 } as any),
  mtoken: bcs.vector(bcs.u8(), { length: 20 } as any),
  nonce: bcs.vector(bcs.u8(), { length: 32 } as any),
  chain_id: bcs.u64(),
});

export async function withdrawMToken(
  config: Pick<UserConfig, "adapter" | "chainId" | "medusaURL">,
  tokenAddress: Address,
  amount: bigint,
) {
  const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const chainId = config.chainId;

  const addresses = await requestAccounts(config);
  const [address] = addresses;

  const userAddressBytes = toBytes(address);
  const mTokenAddressBytes = toBytes(tokenAddress);
  const bcsPayload = WithdrawMtokensPayload.serialize({
    chain_id: chainId,
    address: userAddressBytes,
    mtoken: mTokenAddressBytes,
    amount: toU256Bytes(amount),
    nonce: toU256Bytes(nonce),
  });

  const hexMessage = toHex(bcsPayload.toBytes());
  const signature = await config.adapter.request<Hex>({
    method: "personal_sign",
    params: [hexMessage, address],
  });
  const provider = getMedusaProvider(config);
  return provider.withdrawMtokens({
    payload: {
      chain_id: chainId,
      address,
      mtoken: tokenAddress,
      amount: amount.toString(),
      nonce: nonce.toString(),
    },
    signature,
  });
}
