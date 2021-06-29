import { CW20Addr, HumanAddr, StableDenom } from '@anchor-protocol/types';
import { MarketBAsset, marketBAssetQuery } from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    {
      mantleEndpoint,
      mantleFetch,
      bLunaContract,
      oracleContract,
      custodyContract,
    },
  ],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      bLunaContract: CW20Addr;
      oracleContract: HumanAddr;
      custodyContract: HumanAddr;
    },
  ]
>) => {
  return marketBAssetQuery({
    mantleEndpoint,
    mantleFetch,
    wasmQuery: {
      bLunaBalance: {
        contractAddress: bLunaContract,
        query: {
          balance: {
            address: custodyContract,
          },
        },
      },
      oraclePrice: {
        contractAddress: oracleContract,
        query: {
          price: {
            base: bLunaContract,
            quote: 'uusd' as StableDenom,
          },
        },
      },
    },
  });
};

export function useMarketBAssetQuery(): UseQueryResult<
  MarketBAsset | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_BASSET,
      {
        mantleEndpoint,
        mantleFetch,
        bLunaContract: cw20.bLuna,
        oracleContract: moneyMarket.oracle,
        custodyContract: moneyMarket.custody,
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
