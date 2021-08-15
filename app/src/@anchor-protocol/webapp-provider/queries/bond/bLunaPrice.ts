import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBLunaPrice,
  bondBLunaPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    bLunaLunaPairContract: HumanAddr,
  ) => {
    return bondBLunaPriceQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        terraswapPool: {
          contractAddress: bLunaLunaPairContract,
          query: {
            pool: {},
          },
        },
      },
    });
  },
);

export function useBondBLunaPriceQuery(): UseQueryResult<
  BondBLunaPrice | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BLUNA_PRICE,
      mantleEndpoint,
      mantleFetch,
      contractAddress.terraswap.blunaLunaPair,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
