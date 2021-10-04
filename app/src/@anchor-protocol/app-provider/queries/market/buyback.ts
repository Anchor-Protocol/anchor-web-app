import {
  MarketBuybackData,
  marketBuybackQuery,
} from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string, time: '72hrs' | 'total') => {
  return marketBuybackQuery({ endpoint, time });
});

export function useMarketBuybackQuery(
  time: '72hrs' | 'total',
): UseQueryResult<MarketBuybackData | undefined> {
  const { queryErrorReporter, indexerApiEndpoint } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_BUYBACK, indexerApiEndpoint, time],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
