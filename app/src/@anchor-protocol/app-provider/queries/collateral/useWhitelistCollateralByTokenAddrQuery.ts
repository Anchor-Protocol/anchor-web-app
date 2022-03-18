import {
  WhitelistCollateral,
  whitelistCollateralByTokenAddrQuery,
} from '@anchor-protocol/app-fns';
import { useNetwork } from '@anchor-protocol/app-provider/contexts/network';
import { useCW20TokenDisplayInfosQuery } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(whitelistCollateralByTokenAddrQuery);

export function useWhitelistCollateralByTokenAddrQuery(
  collateralToken: CW20Addr,
): UseQueryResult<WhitelistCollateral | undefined> {
  const { network } = useNetwork();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const { data: tokens } = useCW20TokenDisplayInfosQuery();

  const query = useQuery(
    [
      ANCHOR_QUERY_KEY.WHITELIST_COLLATERAL_BY_TOKEN_ADDR,
      contractAddress.moneyMarket.overseer,
      collateralToken,
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
