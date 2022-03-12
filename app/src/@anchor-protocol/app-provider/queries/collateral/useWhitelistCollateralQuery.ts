import { WhitelistCollateral } from '@anchor-protocol/app-fns/queries/collateral/types';
import { whitelistCollateralQuery } from '@anchor-protocol/app-fns/queries/collateral/whitelistCollateralQuery';
import { useNetwork } from '@anchor-protocol/app-provider/contexts/network';
import { useCW20TokenDisplayInfosQuery } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(whitelistCollateralQuery);

export function useWhitelistCollateralQuery(): UseQueryResult<
  WhitelistCollateral[]
> {
  const { network } = useNetwork();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const { data: tokens } = useCW20TokenDisplayInfosQuery();

  const query = useQuery(
    [
      ANCHOR_QUERY_KEY.WHITELIST_COLLATERAL,
      contractAddress.moneyMarket.overseer,
      tokens && tokens[network.name],
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return query;
}
