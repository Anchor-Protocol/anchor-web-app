import { useNetwork } from '@anchor-protocol/app-provider/contexts/network';
import { CW20Addr } from '@libs/types';
import { useAnchorQuery } from 'queries/useAnchorQuery';
import { UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../@anchor-protocol/app-provider/env';
import { WhitelistCollateral } from './types';
import { useWhitelistCollateralQuery } from './useWhitelistCollateralQuery';

export function useWhitelistCollateralByTokenAddrQuery(
  collateralToken: CW20Addr,
): UseQueryResult<WhitelistCollateral | undefined> {
  const { network } = useNetwork();

  const { data: whitelist } = useWhitelistCollateralQuery();

  const query = useAnchorQuery(
    [
      ANCHOR_QUERY_KEY.WHITELIST_COLLATERAL_BY_TOKEN_ADDR,
      collateralToken,
      network.name,
    ],
    (context) => {
      if (whitelist) {
        return whitelist.find(
          (collateral) => collateral.collateral_token === collateralToken,
        );
      }
      return undefined;
    },
    {
      refetchOnMount: false,
      keepPreviousData: true,
    },
  );

  return query;
}
