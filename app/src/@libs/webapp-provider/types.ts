export interface QueryRefetch {
  queryKey: string;
  wait?: number;
}

export type TxRefetchMap = Record<string, (string | QueryRefetch)[]>;
