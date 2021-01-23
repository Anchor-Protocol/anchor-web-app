import { useCallback, useEffect, useRef, useState } from 'react';
import { OperationStop } from '../errors';
import { aborted, subscribeAbort } from './internal/subscribeAbort';
import { useOperationBroadcaster } from './OperationBroadcaster';
import type { OperationOptions, OperationResult, Operator } from './types';

export function useOperation<T1, R>(
  params: OperationOptions<R, [Operator<T1, R>], [T1, R]>,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, R]> | undefined,
];

export function useOperation<T1, T2, R>(
  params: OperationOptions<R, [Operator<T1, T2>, Operator<T2, R>], [T1, T2, R]>,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, R]> | undefined,
];

export function useOperation<T1, T2, T3, R>(
  params: OperationOptions<
    R,
    [Operator<T1, T2>, Operator<T2, T3>, Operator<T3, R>],
    [T1, T2, T3, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, R]> | undefined,
];

export function useOperation<T1, T2, T3, T4, R>(
  params: OperationOptions<
    R,
    [Operator<T1, T2>, Operator<T2, T3>, Operator<T3, T4>, Operator<T4, R>],
    [T1, T2, T3, T4, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, T4, R]> | undefined,
];

export function useOperation<T1, T2, T3, T4, T5, R>(
  params: OperationOptions<
    R,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, R>,
    ],
    [T1, T2, T3, T4, T5, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, T4, T5, R]> | undefined,
];

export function useOperation<T1, T2, T3, T4, T5, T6, R>(
  params: OperationOptions<
    R,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, R>,
    ],
    [T1, T2, T3, T4, T5, T6, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, T4, T5, T6, R]> | undefined,
];

export function useOperation<T1, T2, T3, T4, T5, T6, T7, R>(
  params: OperationOptions<
    R,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, T7>,
      Operator<T7, R>,
    ],
    [T1, T2, T3, T4, T5, T6, T7, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, T4, T5, T6, T7, R]> | undefined,
];

export function useOperation<T1, T2, T3, T4, T5, T6, T7, T8, R>(
  params: OperationOptions<
    R,
    [
      Operator<T1, T2>,
      Operator<T2, T3>,
      Operator<T3, T4>,
      Operator<T4, T5>,
      Operator<T5, T6>,
      Operator<T6, T7>,
      Operator<T7, T8>,
      Operator<T8, R>,
    ],
    [T1, T2, T3, T4, T5, T6, T7, T8, R]
  >,
): [
  (params: T1) => Promise<R | undefined>,
  OperationResult<R, [T1, T2, T3, T4, T5, T6, T7, T8, R]> | undefined,
];

export function useOperation({
  id: _id,
  broadcastWhen = 'unmounted',
  pipe,
  renderBroadcast,
  breakOnError,
}: OperationOptions<Operator<any, any>[], any, any>): [
  (params: any) => Promise<any>,
  OperationResult<any, any> | undefined,
] {
  type R = OperationResult<any, any>;

  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    broadcast,
    stopBroadcast,
    getAbortController,
    setAbortController,
    removeAbortController,
    dispatch,
  } = useOperationBroadcaster();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [id] = useState(() => {
    return typeof _id === 'function'
      ? _id(Math.floor(Math.random() * 100000000))
      : typeof _id === 'string'
      ? _id
      : 'operation!' + Math.floor(Math.floor(Math.random() * 1000000000));
  });

  const onBroadcast = useRef<boolean>(broadcastWhen === 'always');

  const [result, setResult] = useState<R>(() => ({
    status: 'ready',
  }));

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateResult = useCallback(
    (result: OperationResult<any, any>) => {
      if (onBroadcast.current && broadcastWhen !== 'none') {
        broadcast(id, result, renderBroadcast(result));
      } else {
        setResult(result);
      }
    },
    [broadcast, broadcastWhen, id, renderBroadcast],
  );

  const exec = useCallback(
    async (params) => {
      const snapshots = [params];

      getAbortController(id)?.abort();

      const abortController = new AbortController();

      setAbortController(id, abortController);

      const abort = () => abortController.abort();

      const [abortSubscription, teardownAbortSubscription] = subscribeAbort(
        abortController.signal,
      );

      updateResult({
        status: 'in-progress',
        snapshots: snapshots.slice(),
        abort,
      });

      try {
        let value = params;

        let i: number = -1;
        const max: number = pipe.length;

        while (++i < max) {
          const result = await Promise.race([
            pipe[i](value),
            abortSubscription,
          ]);

          if (result === aborted) {
            return undefined;
          }

          snapshots.push(result);

          const isDone = i + 1 === max;

          updateResult(
            isDone
              ? {
                  status: 'done',
                  snapshots: snapshots.slice(),
                  data: result,
                  reset: () => {
                    if (!onBroadcast.current) {
                      setResult({
                        status: 'ready',
                      });
                    }
                  },
                }
              : {
                  status: 'in-progress',
                  snapshots: snapshots.slice(),
                  abort,
                },
          );
        }

        teardownAbortSubscription();
        removeAbortController(id);

        dispatch(id, 'done');
      } catch (error) {
        teardownAbortSubscription();
        removeAbortController(id);

        if (error instanceof OperationStop) {
          stopBroadcast(id);
          return;
        }

        if (
          breakOnError === true ||
          (typeof breakOnError === 'function' && breakOnError(error))
        ) {
          throw error;
        }

        updateResult({
          status: 'fault',
          sanpshots: snapshots.slice(),
          error,
          reset: () => {
            if (!onBroadcast.current) {
              setResult({
                status: 'ready',
              });
            }
          },
        });
      }
    },
    [
      breakOnError,
      dispatch,
      getAbortController,
      id,
      pipe,
      removeAbortController,
      setAbortController,
      stopBroadcast,
      updateResult,
    ],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    return () => {
      onBroadcast.current = true;
    };
  }, []);

  return [exec, result];
}
