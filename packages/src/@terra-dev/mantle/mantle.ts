import { parse, print } from 'graphql';
import { defaultMantleFetch, MantleFetch } from './fetch';
import { DOCUMENT_NODE, findSelectionSet } from './gql';
import {
  parseWasmQueryRawData,
  WasmQueryData,
  WasmQueryInput,
  WasmQueryRawData,
  wasmQueryToFields,
} from './wasm';

export interface MantleParams<WasmQuery, QueryVariables extends {}> {
  query?: string;
  variables: QueryVariables;
  wasmQuery: WasmQueryInput<WasmQuery>;
  mantleFetch?: MantleFetch;
  endpoint: string;
  requestInit?: Omit<RequestInit, 'method' | 'body'>;
}

export async function mantle<
  WasmQuery,
  QueryVariables extends {} = {},
  QueryResult extends {} = {},
>({
  query,
  variables,
  wasmQuery,
  mantleFetch = defaultMantleFetch,
  endpoint,
  requestInit,
}: MantleParams<WasmQuery, QueryVariables>): Promise<
  WasmQueryData<WasmQuery> & QueryResult
> {
  const document = query ? parse(query) : DOCUMENT_NODE;

  const selectionSet = findSelectionSet(document);

  selectionSet.selections = [
    ...selectionSet.selections,
    ...wasmQueryToFields(wasmQuery),
  ];

  const graphqlQuery = print(document);

  const wasmKeys: Array<keyof WasmQuery> = Object.keys(wasmQuery) as Array<
    keyof WasmQuery
  >;

  const rawData = await mantleFetch<
    QueryVariables,
    WasmQueryRawData<WasmQuery> & QueryResult
  >(graphqlQuery, variables, endpoint, requestInit);

  return {
    ...rawData,
    ...parseWasmQueryRawData<WasmQuery>(rawData, wasmKeys),
  } as WasmQueryData<WasmQuery> & QueryResult;
}
