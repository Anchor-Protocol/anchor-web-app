import {
  RewardsAncUstLpRewards,
  rewardsAncUstLpRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsAncUstLpRewardsQuery);

export function useRewardsAncUstLpRewardsQuery(): UseQueryResult<
  RewardsAncUstLpRewards | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { connected, terraWalletAddress } = useAccount();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_ANC_UST_LP_REWARDS,
      terraWalletAddress,
      contractAddress.anchorToken.staking,
      contractAddress.cw20.AncUstLP,
      contractAddress.astroport.generator,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connected ? result : EMPTY_QUERY_RESULT;
}
