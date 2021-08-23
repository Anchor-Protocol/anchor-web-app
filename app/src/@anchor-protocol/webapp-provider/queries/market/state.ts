import { HumanAddr } from '@anchor-protocol/types';
import { MarketState, marketStateQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    marketContract: HumanAddr,
  ) => {
    return marketStateQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        marketState: {
          contractAddress: marketContract,
          query: {
            state: {},
          },
        },
      },
    });
  },
);

export function useMarketStateQuery(): UseQueryResult<MarketState | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_STATE,
      mantleEndpoint,
      mantleFetch,
      moneyMarket.market,
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
