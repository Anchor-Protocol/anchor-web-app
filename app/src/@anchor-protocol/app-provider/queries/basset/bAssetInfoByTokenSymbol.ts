import {
  BAssetInfo,
  bAssetInfoByTokenSymbolQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetInfoByTokenSymbolQuery);

export function useBAssetInfoByTokenSymbolQuery(
  tokenSymbol: string | undefined,
): UseQueryResult<BAssetInfo | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANCHOR_QUERY_BASSET_INFO_BY_TOKEN_SYMBOL,
      contractAddress.moneyMarket.overseer,
      tokenSymbol,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
