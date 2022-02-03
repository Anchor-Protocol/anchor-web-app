import { bAssetInfoByTokenSymbolQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useQueryWithTokenDisplay } from '../utils/tokenDisplay';
import {
  BAssetInfoWithDisplay,
  withBAssetInfoTokenDisplay,
} from './utils/tokenDisplay';

const queryFn = createQueryFn(bAssetInfoByTokenSymbolQuery);

export function useBAssetInfoByTokenSymbolQuery(
  tokenSymbol: string | undefined,
): UseQueryResult<BAssetInfoWithDisplay | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const bAssetInfo = useQuery(
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

  return useQueryWithTokenDisplay(bAssetInfo, withBAssetInfoTokenDisplay);
}
