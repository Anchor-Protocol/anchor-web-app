import {
  RewardsClaimableUstBorrowRewards,
  rewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsClaimableUstBorrowRewardsQuery);

export function useRewardsClaimableUstBorrowRewardsQuery(): UseQueryResult<
  RewardsClaimableUstBorrowRewards | undefined
> {
  const { queryClient, contractAddress, lastSyncedHeight, queryErrorReporter } =
    useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_CLAIMABLE_UST_BORROW_REWARDS,
      connectedWallet?.walletAddress,
      contractAddress.cw20.ANC,
      contractAddress.moneyMarket.market,
      lastSyncedHeight,
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
