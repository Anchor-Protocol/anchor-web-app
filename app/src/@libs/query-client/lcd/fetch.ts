import { LcdFetchError } from '../errors';

export type LcdResult<Data> =
  | {
      height: string;
      result: Data;
    }
  | {
      txhash: string;
      code: number;
      raw_log: string;
    };

export type LcdFetcher = <Data>(
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export function defaultLcdFetcher<Data>(
  endpoint: string,
  requestInit?: RequestInit,
): Promise<Data> {
  return fetch(endpoint, { ...requestInit, cache: 'no-store' })
    .then((res) => res.json())
    .then((data) => {
      if ('code' in data && data.code > 0) {
        throw new LcdFetchError(data.code, data.txhash, data.raw_log);
      }
      return data;
    });
}
