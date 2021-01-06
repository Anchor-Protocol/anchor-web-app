import { BroadcastableQueryStop } from '@anchor-protocol/use-broadcastable-query/types';

export function stopWithAbortSignal<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  if (signal.aborted) {
    return promise;
  }

  let stop: (() => void) | null = null;

  const abortPromise = new Promise<void>((resolve) => {
    stop = resolve;
  });

  function listener() {
    signal.removeEventListener('abort', listener);
    stop && stop();
  }

  signal.addEventListener('abort', listener);

  return Promise.race([
    promise.then((value) => {
      signal.removeEventListener('abort', listener);
      return value;
    }),
    abortPromise.then(() => {
      throw new BroadcastableQueryStop();
    }),
  ]);
}
