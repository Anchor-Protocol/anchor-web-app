export const aborted = '__operation_aborted__' as const;

export function subscribeAbort(
  signal: AbortSignal,
): [Promise<typeof aborted>, () => void] {
  if (signal.aborted) {
    throw new Error('signal already aborted!');
  }

  let resolver: ((abort: typeof aborted) => void) | null = null;

  const promise = new Promise<typeof aborted>((resolve) => {
    resolver = resolve;
  });

  function listener() {
    signal.removeEventListener('abort', listener);
    resolver && resolver(aborted);
  }

  signal.addEventListener('abort', listener);

  function teardown() {
    signal.removeEventListener('abort', listener);
  }

  return [promise, teardown];
}
