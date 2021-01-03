import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNotifiableFetchInternal } from './NotifiableFetchProvider';
import {
  NotifiableFetch,
  NotifiableFetchResult,
  NotificationFactory,
} from './types';

export type NotifiableFetchTargets = 'notifier' | 'continuously';

interface NotifiableFetchParams<Params, Data, Error> {
  group?: string;
  target: NotifiableFetchTargets;
  fetchFactory: NotifiableFetch<Params, Data>;
  notificationFactory: NotificationFactory<Params, Data, Error>;
}

export function useNotifiableFetch<Params, Data, Error = unknown>({
  group: _group,
  target,
  fetchFactory,
  notificationFactory,
}: NotifiableFetchParams<Params, Data, Error>): [
  (params: Params) => Promise<Data | void>,
  NotifiableFetchResult<Params, Data, Error> | undefined,
] {
  type FetchResult = NotifiableFetchResult<Params, Data, Error>;

  const id = useMemo<string>(
    () => _group ?? 'internal-' + Math.floor(Math.random() * 1000000000000000),
    [_group],
  );

  const {
    setNotification,
    getAbortController,
    setAbortController,
    removeAbortController,
  } = useNotifiableFetchInternal();

  const broadcast = useRef<boolean>(target === 'notifier');

  const [result, setResult] = useState<FetchResult>(() => ({
    status: 'ready',
  }));

  const fetch = useCallback<(params: Params) => Promise<Data | void>>(
    async (params) => {
      let intervalId: number | undefined = undefined;

      try {
        getAbortController(id)?.abort();

        const abortController = new AbortController();

        setAbortController(id, abortController);

        const inProgress: FetchResult = {
          status: 'in-progress',
          params,
          abort: abortController.abort,
        };

        if (broadcast.current) {
          setNotification(id, notificationFactory(inProgress));
        } else {
          setResult(inProgress);

          intervalId = setInterval(() => {
            if (broadcast.current) {
              setNotification(id, notificationFactory(inProgress));
              clearInterval(intervalId);
              intervalId = undefined;
            }
          }, 100);
        }

        const data = await fetchFactory(params, abortController.signal);

        if (typeof intervalId === 'number') {
          clearInterval(intervalId);
          intervalId = undefined;
        }

        const done: FetchResult = {
          status: 'done',
          params,
          data,
        };

        if (broadcast.current) {
          setNotification(id, notificationFactory(done));
        } else {
          setResult(done);
        }
      } catch (error) {
        if (typeof intervalId === 'number') {
          clearInterval(intervalId);
          intervalId = undefined;
        }

        const fault: FetchResult = {
          status: 'error',
          params,
          error,
        };

        if (broadcast.current) {
          setNotification(id, notificationFactory(fault));
        } else {
          setResult(fault);
        }
      } finally {
        removeAbortController(id);
      }
    },
    [
      fetchFactory,
      getAbortController,
      id,
      notificationFactory,
      removeAbortController,
      setAbortController,
      setNotification,
    ],
  );

  useEffect(() => {
    return () => {
      broadcast.current = true;
    };
  }, []);

  return [fetch, broadcast.current ? undefined : result];
}
