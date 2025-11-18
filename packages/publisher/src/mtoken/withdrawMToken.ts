import { requestAccounts } from "@intents-sdk/utils";
import type { Address, UserConfig } from "@intents-sdk/utils";
import { getMedusaProvider, signTypeDataV4 } from "@intents-sdk/utils";
import { randomU256BigInt } from "@intents-sdk/utils";

export async function withdrawMToken(
  config: Pick<UserConfig, "adapter" | "chainId" | "medusaURL" | "contract">,
  tokenAddress: Address,
  amount: bigint,
) {
  const nonce = randomU256BigInt();
  const chainId = config.chainId;

  const addresses = await requestAccounts(config);
  const [address] = addresses;

  const typedData = {
    types: {
      Withdraw: [
        { name: "address", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "mtoken", type: "address" },
        { name: "nonce", type: "uint256" },
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
      verifyingContract: config.contract.mTokenManager,
    },
    primaryType: "Withdraw",
    message: {
      address,
      amount: amount.toString(),
      mtoken: tokenAddress,
      nonce: nonce.toString(),
    },
  };

  const signature = await signTypeDataV4(config, address, typedData);

  const provider = getMedusaProvider(config);
  return provider.withdrawMtokens({
    payload: {
      address,
      mtoken: tokenAddress,
      amount: amount.toString(),
      nonce: nonce.toString(),
    },
    signature,
  });
}
