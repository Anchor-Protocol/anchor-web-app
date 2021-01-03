import { ReactElement } from 'react';

export type NotifiableFetchResult<Params, Data, Error> =
  | { status: 'ready' }
  | {
      status: 'in-progress';
      params: Params;
      abortController: AbortController;
    }
  | {
      status: 'done';
      params: Params;
      data: Data;
    }
  | {
      status: 'error';
      params: Params;
      error: Error;
    };

export type NotifiableFetch<Params, Data> = (
  params: Params,
  signal: AbortSignal,
) => Promise<Data>;

export type NotificationFactory<Params, Data, Error> = (
  props: NotifiableFetchResult<Params, Data, Error>,
) => ReactElement<{ close: () => void }>;
