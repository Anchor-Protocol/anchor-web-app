import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryBroadcaster } from './QueryBroadcaster';
import {
  BroadcastableQueryResult,
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

export function useBroadcastableQuery<Params, Data, Error = unknown>({
  group: _group,
  broadcastWhen = 'unmounted',
  fetchClient,
  notificationFactory,
}: BroadcastableQueryOptions<Params, Data, Error>): [
  (params: Params) => Promise<Data | void>,
  BroadcastableQueryResult<Params, Data, Error> | undefined,
] {
  type FetchResult = BroadcastableQueryResult<Params, Data, Error>;

  const id = useMemo<string>(
    () => _group ?? 'internal-' + Math.floor(Math.random() * 1000000000000000),
    [_group],
  );

  const {
    broadcast,
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

        const fault: FetchResult = {
          status: 'error',
          params,
          error,
        };

        removeAbortController(id);

        if (onBroadcast.current) {
          broadcast(id, notificationFactory(fault));
        } else {
          setResult(fault);
        }
      }
    },
    [
      fetchClient,
      getAbortController,
      id,
      notificationFactory,
      removeAbortController,
      setAbortController,
      broadcast,
    ],
  );

  useEffect(() => {
    return () => {
      onBroadcast.current = true;
    };
  }, []);

  return [fetch, onBroadcast.current ? undefined : result];
}
