import { JSONRPCProvider } from "@arcadia-network/utils";
import { useQueries, useQuery } from "@tanstack/react-query";
import type { QueriesResults, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export type QueryProxy<M extends { [K in keyof M]: (...args: any[]) => any }> = {
  [K in keyof M]: {
    useQuery: (
      ...args: [
        ...params: Parameters<M[K]>,
        options?: Omit<
          UseQueryOptions<Awaited<ReturnType<M[K]>>, unknown, Awaited<ReturnType<M[K]>>, [K, ...Parameters<M[K]>]>,
          "queryFn" | "queryKey"
        >,
      ]
    ) => UseQueryResult<Awaited<ReturnType<M[K]>>, unknown>;
    useQueries: <T = Awaited<ReturnType<M[K]>>, TCombinedResult = QueriesResults<Array<T>>>(options: {
      queries: Array<{
        params: Parameters<M[K]>;
        options?: Omit<
          UseQueryOptions<Awaited<ReturnType<M[K]>>, unknown, Awaited<ReturnType<M[K]>>, [K, ...Parameters<M[K]>]>,
          "queryFn" | "queryKey"
        >;
      }>;
      subscribed?: boolean;
      combine?: (results: Array<UseQueryResult<T>>) => TCombinedResult;
    }) => TCombinedResult;
  };
};

export function createQueryProxy<M extends { [K in keyof M]: (...args: any[]) => any }>(
  baseURL: string,
): QueryProxy<M> {
  const provider = new JSONRPCProvider(baseURL);
  return new Proxy(
    {},
    {
      get(_, method: string) {
        return {
          useQuery: (...args: any[]) => {
            const last = args[args.length - 1];
            const hasOptions = !!last && typeof last === "object" && !Array.isArray(last);
            const params = hasOptions ? args.slice(0, -1) : args;
            const options = hasOptions ? last : undefined;

            return useQuery({
              queryKey: [baseURL, method, ...params],
              queryFn: async () =>
                provider.request({
                  method,
                  params,
                }),
              ...options,
            });
          },
          useQueries: ({
            queries,
            ...rest
          }: {
            queries: Array<{
              params: any[];
              options?: UseQueryOptions<any, any, any, any>;
            }>;
            combine?: (results: any[]) => any;
            subscribed?: boolean;
          }) => {
            return useQueries({
              queries: queries.map(({ params, options }) => ({
                queryKey: [baseURL, method, ...params],
                queryFn: async () =>
                  provider.request({
                    method,
                    params,
                  }),
                ...(options ?? {}),
              })),
              ...rest,
            });
          },
        };
      },
    },
  ) as never;
}
