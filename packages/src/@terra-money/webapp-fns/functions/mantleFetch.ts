import { MantleError } from '../errors/MantleError';
import { MantleFetch } from '../types';

export const defaultMantleFetch: MantleFetch = <Variables extends {}, Data>(
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
          throw new MantleError(errors);
        } else {
          throw new Error(String(errors));
        }
      }
      return data;
    }) as Promise<Data>;
};
