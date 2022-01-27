import { BAssetInfo, bAssetInfoQuery } from '@anchor-protocol/app-fns';
import { moneyMarket } from '@anchor-protocol/types';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetInfoQuery);

export function useBAssetInfoQuery(
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number] | undefined,
): UseQueryResult<BAssetInfo | undefined> {
  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.BASSET_INFO, bAsset, queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
