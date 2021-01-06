import { ReactElement } from 'react';

export type BroadcastableQueryResult<Params, Data, Error> =
  | { status: 'ready' }
  | {
      status: 'in-progress';
      params: Params;
      data?: Partial<Data>;
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

export type BroadcatableQueryFetchClient<Params, Data> = (
  params: Params,
  options: {
    signal: AbortSignal;
    inProgressUpdate: (data: Partial<Data>) => void;
  },
) => Promise<Data>;

export type NotificationFactory<Params, Data, Error> = (
  props: BroadcastableQueryResult<Params, Data, Error>,
) => ReactElement<{ close: () => void }>;
