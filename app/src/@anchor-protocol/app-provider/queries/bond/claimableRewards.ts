import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import {
  BondClaimableRewards,
  bondClaimableRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondClaimableRewardsQuery);

export function useBondClaimableRewards(
  rewardDenom: COLLATERAL_DENOMS,
): UseQueryResult<BondClaimableRewards | undefined> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_CLAIMABLE_REWARDS,
      connectedWallet?.walletAddress,
      rewardDenom === COLLATERAL_DENOMS.UBETH
        ? contractAddress.beth.reward
        : contractAddress.bluna.reward,
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
