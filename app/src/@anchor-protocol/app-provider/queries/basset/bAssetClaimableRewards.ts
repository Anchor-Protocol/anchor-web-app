import {
  BAssetClaimableRewards,
  bAssetClaimableRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr } from '@libs/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bAssetClaimableRewardsQuery);

export function useBAssetClaimableRewardsQuery(
  rewardAddr: HumanAddr,
): UseQueryResult<BAssetClaimableRewards | undefined> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS,
      connectedWallet?.walletAddress,
      rewardAddr,
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
