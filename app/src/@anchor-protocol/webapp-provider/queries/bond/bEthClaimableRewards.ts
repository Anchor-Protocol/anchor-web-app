import {
  BondBEthClaimableRewards,
  bondBEthClaimableRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondBEthClaimableRewardsQuery);

export function useBondBEthClaimableRewards(): UseQueryResult<
  BondBEthClaimableRewards | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS,
      connectedWallet?.walletAddress,
      contractAddress.beth.reward,
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
