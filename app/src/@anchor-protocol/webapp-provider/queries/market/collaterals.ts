import {
  MarketCollateralsData,
  marketCollateralsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
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

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_COLLATERALS, indexerApiEndpoint],
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
