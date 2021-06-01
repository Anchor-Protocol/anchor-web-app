import {
  MarketCollateralsData,
  marketCollateralsQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, endpoint],
}: QueryFunctionContext<[string, string]>) => {
  return marketCollateralsQuery({ endpoint });
};

export function useMarketCollateralsQuery(): UseQueryResult<
  MarketCollateralsData | undefined
> {
  const { queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_COLLATERALS, 'https://anchor-services.vercel.app'],
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
