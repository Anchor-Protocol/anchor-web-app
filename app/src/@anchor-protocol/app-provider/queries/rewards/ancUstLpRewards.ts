import {
  RewardsAncUstLpRewards,
  rewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsAncUstLpRewardsQuery);

export function useRewardsAncUstLpRewardsQuery(): UseQueryResult<
  RewardsAncUstLpRewards | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_ANC_UST_LP_REWARDS,
      connectedWallet?.walletAddress,
      contractAddress.anchorToken.staking,
      contractAddress.cw20.AncUstLP,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
