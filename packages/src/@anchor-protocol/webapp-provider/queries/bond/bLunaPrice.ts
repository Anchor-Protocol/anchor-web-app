import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBLunaPriceData,
  bondBLunaPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, bLunaLunaPairContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return bondBLunaPriceQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      bLunaLunaPairContract,
      terraswapPoolQuery: {
        pool: {},
      },
    },
  });
};

export function useBondBLunaPriceQuery(): UseQueryResult<
  BondBLunaPriceData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BLUNA_PRICE,
      mantleEndpoint,
      mantleFetch,
      contractAddress.bluna.hub,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
