import { MarketState, marketStateQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(marketStateQuery);

export function useMarketStateQuery(): UseQueryResult<MarketState | undefined> {
  const { hiveQueryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_STATE,
      contractAddress.moneyMarket.market,
      hiveQueryClient,
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
