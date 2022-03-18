import {
  BAssetClaimableRewardsTotal,
  bAssetClaimableRewardsTotalQuery,
} from '@anchor-protocol/app-fns';
import { useBAssetInfoListQuery } from './bAssetInfoList';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetClaimableRewardsTotalQuery);

export function useBAssetClaimableRewardsTotalQuery(): UseQueryResult<
  BAssetClaimableRewardsTotal | undefined
> {
  const { connected, terraWalletAddress } = useAccount();

  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS_TOTAL,
      terraWalletAddress,
      bAssetInfoList.map(({ custodyConfig }) => custodyConfig.reward_contract),
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connected ? result : EMPTY_QUERY_RESULT;
}
