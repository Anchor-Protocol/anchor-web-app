import { OperationAbort } from './errors';

const Abort = Symbol();

export function withAbortSignal(
  promise: Promise<any>,
  signal: AbortSignal,
): Promise<any> {
  if (signal.aborted) {
    throw new OperationAbort();
  }

  let stop: ((abort: typeof Abort) => void) | null = null;

  const abortPromise = new Promise<typeof Abort>((resolve) => {
    stop = resolve;
  });

  function listener() {
    signal.removeEventListener('abort', listener);
    stop && stop(Abort);
  }

  signal.addEventListener('abort', listener);

  return Promise.race([promise, abortPromise]).then((value: any) => {
    if (value === Abort) {
      throw new OperationAbort();
    }

    signal.removeEventListener('abort', listener);

    return value as any;
  });
}
