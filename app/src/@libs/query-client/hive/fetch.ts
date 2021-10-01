import { HiveFetchError } from '../errors';

export type HiveFetcher = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => Promise<Data>;

export const defaultHiveFetcher: HiveFetcher = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => {
  return fetch(endpoint, {
    ...requestInit,
    method: 'POST',
    headers: {
      ...requestInit?.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .then(({ data, errors }) => {
      if (!!errors) {
        if (Array.isArray(errors)) {
          throw new HiveFetchError(errors);
        } else {
          throw new Error(String(errors));
        }
      }
      return data;
    }) as Promise<Data>;
};

const workerPool: Worker[] = [];

export const webworkerHiveFetcher: HiveFetcher = <Variables extends {}, Data>(
  query: string,
  variables: Variables,
  endpoint: string,
  requestInit?: Omit<RequestInit, 'method' | 'body'>,
) => {
  if (!window.Worker) {
    return defaultHiveFetcher(query, variables, endpoint, requestInit);
  }

  return new Promise<Data>((resolve, reject) => {
    let aborted: boolean = false;
    let init = requestInit?.signal
      ? { ...requestInit, signal: undefined }
      : requestInit;

    const onAbort = () => {
      aborted = true;
      requestInit?.signal?.removeEventListener('abort', onAbort);
    };

    if (requestInit?.signal) {
      requestInit.signal.addEventListener('abort', onAbort);
    }

    const worker: Worker =
      workerPool.length > 0
        ? workerPool.pop()!
        : new Worker('/hiveFetchWorker.js');

    const onMessage = (event: MessageEvent) => {
      if (!aborted) {
        if ('error' in event.data) {
          if (event.data.error.type === 'HiveFetchError') {
            reject(new HiveFetchError(event.data.error.errors));
          } else {
            reject(new Error(event.data.error.error));
          }
        } else if ('data' in event.data) {
          resolve(event.data.data);
        } else {
          console.error(event);
          throw new Error(`Unknown message!`);
        }
      }

      requestInit?.signal?.removeEventListener('abort', onAbort);
      worker.removeEventListener('message', onMessage);

      if (process.env.NODE_ENV === 'production' && workerPool.length > 10) {
        worker.terminate();
      } else {
        workerPool.push(worker);
      }
    };

    worker.addEventListener('message', onMessage);

    worker.postMessage({
      query,
      variables,
      endpoint,
      requestInit: init,
    });
  });
};
