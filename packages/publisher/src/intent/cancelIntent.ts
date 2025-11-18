import type { Address, UserConfig } from "@intents-sdk/utils";
import { requestAccounts } from "@intents-sdk/utils";
import { getMedusaProvider, signTypeDataV4 } from "@intents-sdk/utils";
import { randomU256BigInt } from "@intents-sdk/utils";

export async function cancelIntent(
  config: Pick<UserConfig, "chainId" | "medusaURL" | "adapter" | "contract">,
  intentId: Address,
) {
  const nonce = randomU256BigInt();
  const chainId = config.chainId;

  const addresses = await requestAccounts(config);
  const [address] = addresses;

  const typedData = {
    types: {
      CancelIntent: [
        { name: "nonce", type: "uint256" },
        { name: "intentId", type: "bytes32" },
      ],
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
    },
    domain: {
      name: "Arcadia",
      version: "1",
      chainId: chainId,
      verifyingContract: config.contract.intentBook,
    },
    primaryType: "CancelIntent",
    message: {
      nonce: nonce.toString(),
      intentId,
    },
  };

  const signature = await signTypeDataV4(config, address, typedData);

  const provider = getMedusaProvider(config);
  return provider.cancelIntent({
    payload: {
      intentId,
      nonce: nonce.toString(),
    },
    signature,
  });
}
