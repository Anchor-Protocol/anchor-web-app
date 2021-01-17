import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryBroadcaster } from './QueryBroadcaster';
import {
  BroadcastableQueryResult,
  BroadcastableQueryStop,
  BroadcatableQueryFetchClient,
  NotificationFactory,
} from './types';

export type BroadcastWhen = 'always' | 'unmounted';

export interface BroadcastableQueryOptions<Params, Data, Error> {
  group?: string;
  broadcastWhen?: BroadcastWhen;
  fetchClient: BroadcatableQueryFetchClient<Params, Data>;
  notificationFactory: NotificationFactory<Params, Data, Error>;
}

const stopSignal = new BroadcastableQueryStop();

export function useBroadcastableQuery<Params, Data, Error = unknown>({
  group: _group,
  broadcastWhen = 'unmounted',
  fetchClient,
  notificationFactory,
}: BroadcastableQueryOptions<Params, Data, Error>): [
  (params: Params) => Promise<Data | void>,
  BroadcastableQueryResult<Params, Data, Error> | undefined,
  (() => void) | undefined,
] {
  type FetchResult = BroadcastableQueryResult<Params, Data, Error>;

  const id = useMemo<string>(
    () => _group ?? 'internal-' + Math.floor(Math.random() * 1000000000000000),
    [_group],
  );

  const {
    broadcast,
    dispatch,
    getAbortController,
    setAbortController,
    removeAbortController,
  } = useQueryBroadcaster();

  const onBroadcast = useRef<boolean>(broadcastWhen === 'always');

  const [result, setResult] = useState<FetchResult>(() => ({
    status: 'ready',
  }));

  const fetch = useCallback<(params: Params) => Promise<Data | void>>(
    async (params) => {
      let unmountWatchInterval: number | undefined = undefined;
      let progress: boolean = false;

      try {
        getAbortController(id)?.abort();

        const abortController = new AbortController();

        setAbortController(id, abortController);

        const inProgress: FetchResult = {
          status: 'in-progress',
          params,
          abortController,
        };

        progress = true;

        if (onBroadcast.current) {
          broadcast(id, notificationFactory(inProgress));
        } else {
          setResult(inProgress);

          unmountWatchInterval = setInterval(() => {
            if (onBroadcast.current) {
              broadcast(id, notificationFactory(inProgress));
              clearInterval(unmountWatchInterval);
              unmountWatchInterval = undefined;
            }
          }, 100);
        }

        const data = await fetchClient(params, {
          signal: abortController.signal,
          inProgressUpdate: (partialData) => {
            if (!progress) return;

            const inProgress: FetchResult = {
              status: 'in-progress',
              params,
              abortController,
              data: partialData,
            };

            if (onBroadcast.current) {
              broadcast(id, notificationFactory(inProgress));
            } else {
              setResult(inProgress);
            }
          },
          stopSignal,
        });

        progress = false;

        if (typeof unmountWatchInterval === 'number') {
          clearInterval(unmountWatchInterval);
          unmountWatchInterval = undefined;
        }

        const done: FetchResult = {
          status: 'done',
          params,
          data,
        };

        removeAbortController(id);

        dispatch(id, 'done');

        if (onBroadcast.current) {
          broadcast(id, notificationFactory(done));
        } else {
          setResult(done);
          return data;
        }
      } catch (error) {
        if (typeof unmountWatchInterval === 'number') {
          clearInterval(unmountWatchInterval);
          unmountWatchInterval = undefined;
        }

        removeAbortController(id);

        if (error instanceof BroadcastableQueryStop) {
          return;
        }

        if (process.env.NODE_ENV === 'development') {
          throw error;
        }

        const fault: FetchResult = {
          status: 'error',
          params,
          error,
        };

        if (onBroadcast.current) {
          broadcast(id, notificationFactory(fault));
        } else {
          setResult(fault);
        }
      }
    },
    [
      getAbortController,
      id,
      setAbortController,
      fetchClient,
      removeAbortController,
      dispatch,
      broadcast,
      notificationFactory,
    ],
  );

  const reset = useCallback(() => {
    if (!onBroadcast.current) {
      setResult({ status: 'ready' });
    }
  }, []);

  useEffect(() => {
    return () => {
      onBroadcast.current = true;
    };
  }, []);

  return onBroadcast.current
    ? [fetch, undefined, undefined]
    : [fetch, result, reset];
}
