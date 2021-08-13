import { parse, print } from 'graphql';
import { defaultMantleFetch, MantleFetch } from './fetch';
import { createDocumentNode, findSelectionSet } from './gql';
import {
  parseWasmQueryRawData,
  WasmQueryData,
  WasmQueryInput,
  WasmQueryRawData,
  wasmQueryToFields,
} from './wasm';

export interface MantleParams<WasmQuery, QueryVariables extends {} = {}> {
  query?: string;
  variables: QueryVariables;
  wasmQuery: WasmQueryInput<WasmQuery>;
  mantleFetch?: MantleFetch;
  mantleEndpoint: string;
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
  mantleEndpoint,
  requestInit,
}: MantleParams<WasmQuery, QueryVariables>): Promise<
  WasmQueryData<WasmQuery> & QueryResult
> {
  const document = query ? parse(query) : createDocumentNode();

  const selectionSet = findSelectionSet(document);

  selectionSet.selections = [
    ...selectionSet.selections,
    ...wasmQueryToFields(wasmQuery),
  ];

  const graphqlQuery = print(document);

  try {
    if (process.env.MANTLE_GRAPHQL_PRINT) {
      console.log(graphqlQuery);
    }
  } catch {}

  const wasmKeys: Array<keyof WasmQuery> = Object.keys(wasmQuery) as Array<
    keyof WasmQuery
  >;

  const rawData = await mantleFetch<
    QueryVariables,
    WasmQueryRawData<WasmQuery> & QueryResult
  >(graphqlQuery, variables, mantleEndpoint, requestInit);

  return {
    ...rawData,
    ...parseWasmQueryRawData<WasmQuery>(rawData, wasmKeys),
  } as WasmQueryData<WasmQuery> & QueryResult;
}
