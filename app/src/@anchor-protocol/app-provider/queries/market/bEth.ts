import { MarketBEthData, marketBEthQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketBEthQuery({ endpoint });
});

export function useMarketBEthQuery(): UseQueryResult<
  MarketBEthData | undefined
> {
  const { indexerApiEndpoint, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_BETH, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
