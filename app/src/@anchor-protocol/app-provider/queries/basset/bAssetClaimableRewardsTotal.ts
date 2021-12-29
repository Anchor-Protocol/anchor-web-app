import {
  BAssetClaimableRewardsTotal,
  bAssetClaimableRewardsTotalQuery,
} from '@anchor-protocol/app-fns';
import { useBAssetInfoListQuery } from './bAssetInfoList';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetClaimableRewardsTotalQuery);

export function useBAssetClaimableRewardsTotalQuery(): UseQueryResult<
  BAssetClaimableRewardsTotal | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS_TOTAL,
      connectedWallet?.walletAddress,
      bAssetInfoList.map(({ custodyConfig }) => custodyConfig.reward_contract),
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
