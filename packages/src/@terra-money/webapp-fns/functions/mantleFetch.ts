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
    .then(({ data }) => data) as Promise<Data>;
};
