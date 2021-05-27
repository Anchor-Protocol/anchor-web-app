import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBLunaExchangeRateData,
  bondBLunaExchangeRateQuery,
} from '@anchor-protocol/webapp-fns';

import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, bLunaHubContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return bondBLunaExchangeRateQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      bLunaHubContract,
      stateQuery: {
        state: {},
      },
      parametersQuery: {
        parameters: {},
      },
    },
  });
};

export function useBondBLunaExchangeRateQuery(): UseQueryResult<
  BondBLunaExchangeRateData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { contractAddress } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BLUNA_EXCHANGE_RATE,
      mantleEndpoint,
      mantleFetch,
      contractAddress.bluna.hub,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
    },
  );
}
