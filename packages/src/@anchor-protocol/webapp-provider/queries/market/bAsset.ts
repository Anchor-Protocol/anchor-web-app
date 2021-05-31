import { CW20Addr, HumanAddr, StableDenom } from '@anchor-protocol/types';
import {
  MarketBAssetData,
  marketBAssetQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    bLunaContract,
    oracleContract,
    custodyContract,
  ],
}: QueryFunctionContext<
  [string, string, MantleFetch, CW20Addr, HumanAddr, HumanAddr]
>) => {
  return marketBAssetQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      bLunaContract,
      bLunaBalanceQuery: {
        balance: {
          address: custodyContract,
        },
      },
      oracleContract,
      oraclePriceQuery: {
        price: {
          base: bLunaContract,
          quote: 'uusd' as StableDenom,
        },
      },
    },
  });
};

export function useMarketBAssetQuery(): UseQueryResult<
  MarketBAssetData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_BASSET,
      mantleEndpoint,
      mantleFetch,
      cw20.bLuna,
      moneyMarket.oracle,
      moneyMarket.custody,
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
