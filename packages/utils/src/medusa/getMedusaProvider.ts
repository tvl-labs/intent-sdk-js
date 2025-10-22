import type { UserConfig } from "../types";
import { ConfigurationMissingError } from "../utils/error";
import { JSONRPCProvider } from "../utils/JsonRPCProvider";
import type { MedusaProvider } from "../types/medusa";

export function getMedusaProvider(config: Pick<UserConfig, "medusaURL">) {
  if (!config.medusaURL) throw new ConfigurationMissingError("Missing parameter `medusaURL`");
  return JSONRPCProvider.createProxy<MedusaProvider>(config.medusaURL);
}
