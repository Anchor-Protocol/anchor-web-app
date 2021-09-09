import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsClaimableAncUstLpRewards,
  rewardsClaimableAncUstLpRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch } from '@libs/mantle';
import { EMPTY_QUERY_RESULT, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    lastSyncedHeight: () => Promise<number>,
    ancUstLpContract: CW20Addr,
    ancUstLpStakingContract: HumanAddr,
    connectedWallet: ConnectedWallet | undefined,
  ) => {
    return !!connectedWallet
      ? rewardsClaimableAncUstLpRewardsQuery({
          mantleEndpoint,
          mantleFetch,
          lastSyncedHeight,
          wasmQuery: {
            lPBalance: {
              contractAddress: ancUstLpContract,
              query: {
                balance: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
            lPStakerInfo: {
              contractAddress: ancUstLpStakingContract,
              query: {
                staker_info: {
                  staker: connectedWallet.walletAddress,
                  block_height: -1,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useRewardsClaimableAncUstLpRewardsQuery(): UseQueryResult<
  RewardsClaimableAncUstLpRewards | undefined
> {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { cw20, anchorToken },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_CLAIMABLE_ANC_UST_LP_REWARDS,
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      cw20.AncUstLP,
      anchorToken.staking,
      connectedWallet,
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
