import { HumanAddr } from '@anchor-protocol/types';
import { MarketState, marketStateQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, { mantleEndpoint, mantleFetch, marketContract }],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      marketContract: HumanAddr;
    },
  ]
>) => {
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
};

export function useMarketStateQuery(): UseQueryResult<MarketState | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_STATE,
      {
        mantleEndpoint,
        mantleFetch,
        marketContract: moneyMarket.market,
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
