export interface LcdResult<Data> {
  height: string;
  result: Data;
}

export type LcdFetcher = <Data>(
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export function defaultLcdFetcher<Data>(
  endpoint: string,
  requestInit?: RequestInit,
): Promise<Data> {
  return fetch(endpoint, requestInit).then((res) => res.json());
}
