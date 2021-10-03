import {
  BondBLunaPrice,
  bondBLunaPriceQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondBLunaPriceQuery);

export function useBondBLunaPriceQuery(): UseQueryResult<
  BondBLunaPrice | undefined
> {
  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BLUNA_PRICE,
      contractAddress.terraswap.blunaLunaPair,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
