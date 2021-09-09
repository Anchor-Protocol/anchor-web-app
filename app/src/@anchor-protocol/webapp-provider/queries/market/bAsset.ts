import {
  CollateralType,
  CW20Addr,
  HumanAddr,
  NativeDenom,
} from '@anchor-protocol/types';
import { MarketBAsset, marketBAssetQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch } from '@libs/mantle';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    bLunaContract: CW20Addr,
    oracleContract: HumanAddr,
    custodyContract: HumanAddr,
  ) => {
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
              quote: 'uusd' as NativeDenom,
            },
          },
        },
      },
    });
  },
);

export function useMarketBAssetQuery(): UseQueryResult<
  MarketBAsset | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket, cw20 },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.MARKET_BASSET,
      mantleEndpoint,
      mantleFetch,
      cw20.bLuna,
      moneyMarket.oracle,
      moneyMarket.collaterals[CollateralType.bLuna].custody,
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
