import { HumanAddr, uUST } from '@anchor-protocol/types';
import {
  MarketStableCoinData,
  marketStableCoinQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useMarketStateQuery } from './state';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    interestContract,
    overseerContract,
    uUSTBalance,
    totalReserves,
    totalLiabilities,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    HumanAddr,
    HumanAddr,
    uUST | undefined,
    uUST | undefined,
    uUST | undefined,
  ]
>) => {
  return uUSTBalance && totalReserves && totalLiabilities
    ? marketStableCoinQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          interestContract,
          overseerContract,
          borrowRateQuery: {
            borrow_rate: {
              market_balance: uUSTBalance,
              total_reserves: totalReserves,
              total_liabilities: totalLiabilities,
            },
          },
          epochStateQuery: {
            epoch_state: {},
          },
        },
      })
    : undefined;
};

export function useMarketStableCoinQuery(): UseQueryResult<
  MarketStableCoinData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const { data: { marketState, marketBalances } = {} } = useMarketStateQuery();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_STABLE_COIN,
      mantleEndpoint,
      mantleFetch,
      moneyMarket.interestModel,
      moneyMarket.overseer,
      marketBalances?.uUST,
      marketState?.total_reserves,
      marketState?.total_liabilities,
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
