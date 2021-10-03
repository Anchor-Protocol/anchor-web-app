import {
  BondValidators,
  bondValidatorsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondValidatorsQuery);

export function useBondValidators(): UseQueryResult<
  BondValidators | undefined
> {
  const { hiveQueryClient, queryErrorReporter } = useAnchorWebapp();

  const { contractAddress } = useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_VALIDATORS,
      contractAddress.bluna.hub,
      hiveQueryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 10,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
