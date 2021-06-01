import {
  MarketBuybackData,
  marketBuybackQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, endpoint, time],
}: QueryFunctionContext<[string, string, '72hrs' | 'total']>) => {
  return marketBuybackQuery({ endpoint, time });
};

export function useMarketBuybackQuery(
  time: '72hrs' | 'total',
): UseQueryResult<MarketBuybackData | undefined> {
  const { queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_BUYBACK,
      'https://anchor-services.vercel.app',
      time,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
