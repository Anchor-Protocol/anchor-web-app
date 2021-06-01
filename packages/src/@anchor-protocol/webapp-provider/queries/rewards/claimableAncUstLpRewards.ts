import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsClaimableAncUstLpRewardsData,
  rewardsClaimableAncUstLpRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    lastSyncedHeight,
    ancUstLpContract,
    ancUstLpStakingContract,
    connectedWallet,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    () => Promise<number>,
    CW20Addr,
    HumanAddr,
    ConnectedWallet | undefined,
  ]
>) => {
  return !!connectedWallet
    ? rewardsClaimableAncUstLpRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        variables: {
          ancUstLpContract,
          ancUstLpStakingContract,
          ancUstLpBalanceQuery: {
            balance: {
              address: connectedWallet.walletAddress,
            },
          },
          lPStakerInfoQuery: {
            staker_info: {
              staker: connectedWallet.walletAddress,
              block_height: -1,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useRewardsClaimableAncUstLpRewardsQuery(): UseQueryResult<
  RewardsClaimableAncUstLpRewardsData | undefined
> {
  const {
    mantleFetch,
    mantleEndpoint,
    lastSyncedHeight,
    queryErrorReporter,
  } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { cw20, anchorToken },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

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
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
