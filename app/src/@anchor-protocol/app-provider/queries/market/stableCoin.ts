import {
  MarketStableCoin,
  marketStableCoinQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useMarketStateQuery } from './state';

const queryFn = createQueryFn(marketStableCoinQuery);

export function useMarketStableCoinQuery(): UseQueryResult<
  MarketStableCoin | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { data: { marketState, marketBalances } = {} } = useMarketStateQuery();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_STABLE_COIN,
      contractAddress.moneyMarket.interestModel,
      contractAddress.moneyMarket.overseer,
      marketBalances?.uUST,
      marketState?.total_reserves,
      marketState?.total_liabilities,
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
