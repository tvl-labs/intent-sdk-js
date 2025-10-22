import type { DefaultError, MutationOptions } from "@tanstack/react-query";

export type PickedMutationOptions<TData, TVariables = void, TError = DefaultError, TContext = unknown> = Pick<
  MutationOptions<TData, TError, TVariables, TContext>,
  "mutationKey" | "onMutate" | "onSuccess" | "onError" | "onSettled" | "retry" | "retryDelay" | "networkMode" | "gcTime"
>;
