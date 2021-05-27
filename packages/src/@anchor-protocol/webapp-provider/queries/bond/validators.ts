import { HumanAddr } from '@anchor-protocol/types';
import {
  BondValidatorsData,
  bondValidatorsQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, mantleEndpoint, mantleFetch, bLunaHubContract],
}: QueryFunctionContext<[string, string, MantleFetch, HumanAddr]>) => {
  return bondValidatorsQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      bLunaHubContract,
      whitelistedValidatorsQuery: {
        whitelisted_validators: {},
      },
    },
  });
};

export function useBondValidators(): UseQueryResult<
  BondValidatorsData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { contractAddress } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_VALIDATORS,
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
