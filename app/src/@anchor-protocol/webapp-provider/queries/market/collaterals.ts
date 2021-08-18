import {
  MarketCollateralsData,
  marketCollateralsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketCollateralsQuery({ endpoint });
});

export function useMarketCollateralsQuery(): UseQueryResult<
  MarketCollateralsData | undefined
> {
  const { queryErrorReporter } = useTerraWebapp();

  const { indexerApiEndpoint } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_COLLATERALS, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
