import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsAncUstLpRewards,
  rewardsAncUstLpRewardsQuery,
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
    {
      mantleEndpoint,
      mantleFetch,
      stakingContract,
      ancUstLpContract,
      connectedWallet,
    },
  ],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      stakingContract: HumanAddr;
      ancUstLpContract: CW20Addr;
      connectedWallet: ConnectedWallet | undefined;
    },
  ]
>) => {
  return !!connectedWallet
    ? rewardsAncUstLpRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          userLPBalance: {
            contractAddress: ancUstLpContract,
            query: {
              balance: {
                address: connectedWallet.walletAddress,
              },
            },
          },
          userLPStakingInfo: {
            contractAddress: stakingContract,
            query: {
              staker_info: {
                staker: connectedWallet.walletAddress,
              },
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useRewardsAncUstLpRewardsQuery(): UseQueryResult<
  RewardsAncUstLpRewards | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { anchorToken, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_ANC_UST_LP_REWARDS,
      {
        mantleEndpoint,
        mantleFetch,
        stakingContract: anchorToken.staking,
        ancUstLpContract: cw20.AncUstLP,
        connectedWallet,
      },
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
