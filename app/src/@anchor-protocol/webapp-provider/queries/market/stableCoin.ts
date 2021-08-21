import { HumanAddr, uUST } from '@anchor-protocol/types';
import {
  MarketStableCoin,
  marketStableCoinQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useMarketStateQuery } from './state';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    interestContract: HumanAddr,
    overseerContract: HumanAddr,
    uUSTBalance: uUST | undefined,
    totalReserves: uUST | undefined,
    totalLiabilities: uUST | undefined,
  ) => {
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
      : Promise.resolve(undefined);
  },
);

export function useMarketStableCoinQuery(): UseQueryResult<
  MarketStableCoin | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

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
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
