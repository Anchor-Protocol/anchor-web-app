import { parse, print } from 'graphql';
import {
  WasmFetchBaseParams,
  WasmQueryData,
  WasmQueryRawData,
} from '../interface';
import { defaultHiveFetcher, HiveFetcher } from './fetch';
import { createDocumentNode, findSelectionSet } from './gql';
import { parseWasmQueryRawData, wasmQueryToFields } from './wasm';

export interface HiveFetchParams<WasmQueries, QueryVariables extends {} = {}>
  extends WasmFetchBaseParams<WasmQueries> {
  query?: string;
  variables: QueryVariables;
  hiveFetcher?: HiveFetcher;
  hiveEndpoint: string;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
}

export async function hiveFetch<
  WasmQueries,
  GraphqlQueryVariables extends {} = {},
  GraphqlQueryResult extends {} = {},
>({
  id,
  query,
  variables,
  wasmQuery,
  hiveFetcher = defaultHiveFetcher,
  hiveEndpoint,
  requestInit,
}: HiveFetchParams<WasmQueries, GraphqlQueryVariables>): Promise<
  WasmQueryData<WasmQueries> & GraphqlQueryResult
> {
  const document = query ? parse(query) : createDocumentNode();

  const selectionSet = findSelectionSet(document);

  selectionSet.selections = [
    ...selectionSet.selections,
    ...wasmQueryToFields(wasmQuery),
  ];

  const graphqlQuery = print(document);

  try {
    if (process.env.HIVE_GRAPHQL_PRINT) {
      console.log(graphqlQuery);
    }
  } catch {}

  const wasmKeys: Array<keyof WasmQueries> = Object.keys(wasmQuery) as Array<
    keyof WasmQueries
  >;

  const rawData = await hiveFetcher<
    GraphqlQueryVariables,
    WasmQueryRawData<WasmQueries> & GraphqlQueryResult
  >(
    graphqlQuery,
    variables,
    id ? `${hiveEndpoint}?${id}` : hiveEndpoint,
    requestInit,
  );

  const result = {
    ...rawData,
    ...parseWasmQueryRawData<WasmQueries>(rawData, wasmKeys),
  } as WasmQueryData<WasmQueries> & GraphqlQueryResult;

  return result;
}
