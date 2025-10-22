import type { InvalidState } from "../types";

export class ContractNotFoundError extends Error {
  override name = "ContractNotFoundError";
  constructor(message?: string) {
    super(message ?? "Contract not found");
  }
}
export class RpcURLNotFoundError extends Error {
  override name = "RpcURLNotFoundError";
  constructor(message?: string) {
    super(message ?? "RPC URL not found");
  }
}
export class ChainNotFoundError extends Error {
  override name = "ChainNotFoundError";
  constructor(message?: string) {
    super(message ?? "Chain not found");
  }
}
export class MTokenNotFoundError extends Error {
  override name = "MTokenNotFoundError";
  constructor(message?: string) {
    super(message ?? "MToken not found");
  }
}
export class TokenNotFoundError extends Error {
  override name = "TokenNotFoundError";
  constructor(message?: string) {
    super(message ?? "Token not found");
  }
}
export class ConfigurationMissingError extends Error {
  override name = "ConfigurationMissingError";
  constructor(message?: string) {
    super(message ?? "MToken not found");
  }
}
export class TimeoutError extends Error {
  override name = "TimeoutError";
  constructor(message?: string) {
    super(message ?? "Timeout error");
  }
}
export class AccountNotConnectedError extends Error {
  override name = "AccountNotConnectedError";
  constructor(message?: string) {
    super(message ?? "Account not connected");
  }
}
export class InvalidIntentError extends Error {
  override name = "InvalidIntentError";
  constructor(
    readonly state: InvalidState,
    message?: string,
  ) {
    super(message ?? "Invalid Intent");
  }
}

export class VaultNotFoundError extends Error {
  override name = "VaultNotFoundError";
  constructor(message?: string) {
    super(message ?? "Vault not found");
  }
}
