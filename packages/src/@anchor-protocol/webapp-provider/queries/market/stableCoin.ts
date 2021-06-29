import { HumanAddr, uUST } from '@anchor-protocol/types';
import {
  MarketStableCoin,
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
    {
      mantleEndpoint,
      mantleFetch,
      interestContract,
      overseerContract,
      uUSTBalance,
      totalReserves,
      totalLiabilities,
    },
  ],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      interestContract: HumanAddr;
      overseerContract: HumanAddr;
      uUSTBalance: uUST | undefined;
      totalReserves: uUST | undefined;
      totalLiabilities: uUST | undefined;
    },
  ]
>) => {
  return uUSTBalance && totalReserves && totalLiabilities
    ? marketStableCoinQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          borrowRate: {
            contractAddress: interestContract,
            query: {
              borrow_rate: {
                market_balance: uUSTBalance,
                total_reserves: totalReserves,
                total_liabilities: totalLiabilities,
              },
            },
          },
          epochState: {
            contractAddress: overseerContract,
            query: {
              epoch_state: {},
            },
          },
        },
      })
    : undefined;
};

export function useMarketStableCoinQuery(): UseQueryResult<
  MarketStableCoin | undefined
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
      {
        mantleEndpoint,
        mantleFetch,
        interestContract: moneyMarket.interestModel,
        overseerContract: moneyMarket.overseer,
        uUSTBalance: marketBalances?.uUST,
        totalReserves: marketState?.total_reserves,
        totalLiabilities: marketState?.total_liabilities,
      },
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
