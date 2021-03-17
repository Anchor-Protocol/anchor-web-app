import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client';
import { QueryOptions } from '@apollo/client/core/watchQueryOptions';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { useDeepMemo } from '@terra-dev/use-deep-memo';
import { useCallback, useMemo } from 'react';

export interface WasmQueryVariables {
  address: HumanAddr | CW20Addr;
  query: string;
}

export interface WasmQueryResult {
  result?: {
    Result: string;
  };
}

export type UseWasmQueryOptions<Query extends {}> = Omit<
  QueryHookOptions,
  'variables' | 'query'
> & {
  id: string;
  address: HumanAddr | CW20Addr;
  query: Query | undefined | null | false;
};

export type UseWasmQueryReturn<Query extends {}, Response extends {}> = Omit<
  QueryResult<WasmQueryResult, WasmQueryVariables>,
  'data' | 'refetch'
> & {
  data: Response | undefined;
  refetch: (query?: Query) => Promise<ApolloQueryResult<Response | undefined>>;
};

export const WASM_QUERY = (id: string) => `
query __${id}($address: String!, $query: String!) {
  result: WasmContractsContractAddressStore(
    ContractAddress: $address
    QueryMsg: $query
  ) {
    Result
  }
}
`;

export function useWasmQuery<Query extends {}, Response extends {}>({
  id,
  address,
  query,
  skip,
  fetchPolicy = 'network-only',
  nextFetchPolicy = 'cache-first',
  ...options
}: UseWasmQueryOptions<Query>): UseWasmQueryReturn<Query, Response> {
  const graphqlQuery = useMemo(() => gql(WASM_QUERY(id)), [id]);

  const variables = useDeepMemo(() => {
    if (!query) {
      return undefined;
    }

    return {
      address,
      query: JSON.stringify(query),
    };
  }, [address, query]);

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    ...result
  } = useQuery<WasmQueryResult, WasmQueryVariables>(graphqlQuery, {
    ...options,
    fetchPolicy,
    nextFetchPolicy,
    skip: skip || !variables,
    variables,
  });

  const data: Response | undefined = _data?.result
    ? JSON.parse(_data.result.Result)
    : undefined;

  const refetch = useCallback(
    (query?: Query): Promise<ApolloQueryResult<Response | undefined>> => {
      return _refetch(
        query ? { query: JSON.stringify(query) } : undefined,
      ).then(
        ({ data: _data, ...result }: ApolloQueryResult<WasmQueryResult>) => {
          return {
            ...result,
            data: _data?.result
              ? (JSON.parse(_data.result.Result) as Response)
              : undefined,
          };
        },
      );
    },
    [_refetch],
  );

  return {
    ...result,
    data,
    refetch,
  };
}

export type WasmQueryOptions<Query extends {}> = Omit<
  QueryOptions<WasmQueryResult, WasmQueryVariables>,
  'variables' | 'query'
> & {
  id: string;
  address: HumanAddr | CW20Addr;
  query: Query;
};

export type WasmQueryReturn<Response extends {}> = ApolloQueryResult<
  Response | undefined
>;

export async function wasmQuery<Query extends {}, Response extends {}>(
  client: ApolloClient<any>,
  {
    id,
    address,
    query,
    fetchPolicy = 'network-only',
    ...options
  }: WasmQueryOptions<Query>,
): Promise<WasmQueryReturn<Response>> {
  const graphqlQuery = gql(WASM_QUERY(id));

  const variables = {
    address,
    query: JSON.stringify(query),
  };

  const { data: _data, ...result } = await client.query<
    WasmQueryResult,
    WasmQueryVariables
  >({
    ...options,
    query: graphqlQuery,
    fetchPolicy,
    variables,
  });

  const data = _data?.result ? JSON.parse(_data.result.Result) : undefined;

  return {
    ...result,
    data,
  };
}
