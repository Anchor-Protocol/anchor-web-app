/* eslint-disable @typescript-eslint/no-unused-vars */

export interface WasmQuery<Query extends {}, Response extends {}> {
  query: Query;
  response: Response;
}

export type WasmQueryInput<T> = {
  [P in keyof T]: T[P] extends WasmQuery<infer Q, infer R>
    ? { contractAddress: string; query: Q }
    : never;
};

export type WasmQueryRawData<T> = {
  [P in keyof T]: { Result: string; Height: string };
};

export type WasmQueryData<T> = {
  [P in keyof T]: T[P] extends WasmQuery<infer Q, infer R> ? R : never;
} & { $blockHeight?: number };

export interface WasmFetchBaseParams<WasmQueries extends {}> {
  id?: string;
  wasmQuery: WasmQueryInput<WasmQueries>;
}
