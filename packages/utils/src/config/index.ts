import type { UserConfig } from "../types";

export function defineConfig<C extends Partial<UserConfig>>(config: C): C {
  return config;
}

export * from "./premit2";
export * from "./number";
export * from "./address";
