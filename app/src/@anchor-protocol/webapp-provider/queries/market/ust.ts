import { MarketUstData, marketUstQuery } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketUstQuery({ endpoint });
});

export function useMarketUstQuery(): UseQueryResult<MarketUstData | undefined> {
  const { queryErrorReporter } = useTerraWebapp();

  const { indexerApiEndpoint } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_UST, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
