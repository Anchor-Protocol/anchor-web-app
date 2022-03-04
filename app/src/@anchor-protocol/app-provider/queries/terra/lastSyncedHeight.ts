import { useNetwork } from '@anchor-protocol/app-provider';
import { lastSyncedHeightQuery } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const storageKey = (mantleEndpoint: string) =>
  `__anchor_last_synced_height__?mantle=${mantleEndpoint}`;

const queryFn = createQueryFn((queryClient: QueryClient, chainID: string) => {
  return lastSyncedHeightQuery(queryClient).then((blockHeight) => {
    localStorage.setItem(storageKey(chainID), blockHeight.toString());
    return blockHeight;
  });
});

export function useLastSyncedHeightQuery(): UseQueryResult<number> {
  const { network } = useNetwork();
  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.TERRA_LAST_SYNCED_HEIGHT, queryClient, network.chainID],
    queryFn,
    {
      refetchInterval: 1000 * 60,
      keepPreviousData: true,
      onError: queryErrorReporter,
      placeholderData: () => {
        return +(localStorage.getItem(storageKey(network.chainID)) ?? '0');
      },
    },
  );

  return result;
}
