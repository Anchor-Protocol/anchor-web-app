import { createQueryFn } from '@libs/react-query-utils';
import {
  lastSyncedHeightQuery,
  MantleFetch,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const storageKey = (mantleEndpoint: string) =>
  `__anchor_last_synced_height__?mantle=${mantleEndpoint}`;

const queryFn = createQueryFn(
  (mantleEndpoint: string, mantleFetch: MantleFetch) => {
    return lastSyncedHeightQuery({ mantleEndpoint, mantleFetch }).then(
      (blockHeight) => {
        localStorage.setItem(
          storageKey(mantleEndpoint),
          blockHeight.toString(),
        );
        return blockHeight;
      },
    );
  },
);

export function useLastSyncedHeightQuery(): UseQueryResult<number> {
  const { mantleEndpoint, mantleFetch, queryErrorReporter } = useTerraWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.TERRA_LAST_SYNCED_HEIGHT, mantleEndpoint, mantleFetch],
    queryFn,
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: true,
      onError: queryErrorReporter,
      placeholderData: () => {
        return +(localStorage.getItem(storageKey(mantleEndpoint)) ?? '0');
      },
    },
  );

  return result;
}
