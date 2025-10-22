import type { UseMutationResult } from "@tanstack/react-query";

export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type AliasedMutationResult<TData, TVariables, Alias extends string, TError = Error, TContext = unknown> = Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  "mutate" | "mutateAsync"
> & {
  [K in Alias]: UseMutationResult<TData, TError, TVariables, TContext>["mutate"];
} & {
  [K in `${Alias}Async`]: UseMutationResult<TData, TError, TVariables, TContext>["mutateAsync"];
};
