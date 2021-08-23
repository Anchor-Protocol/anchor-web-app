import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBLunaExchangeRate,
  bondBLunaExchangeRateQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    bLunaHubContract: HumanAddr,
  ) => {
    return bondBLunaExchangeRateQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        state: {
          contractAddress: bLunaHubContract,
          query: {
            state: {},
          },
        },
        parameters: {
          contractAddress: bLunaHubContract,
          query: {
            parameters: {},
          },
        },
      },
    });
  },
);

export function useBondBLunaExchangeRateQuery(): UseQueryResult<
  BondBLunaExchangeRate | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BLUNA_EXCHANGE_RATE,
      mantleEndpoint,
      mantleFetch,
      contractAddress.bluna.hub,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
