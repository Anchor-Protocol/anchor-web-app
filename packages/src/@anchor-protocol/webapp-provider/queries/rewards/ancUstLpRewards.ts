import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsAncUstLpRewardsData,
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
    mantleEndpoint,
    mantleFetch,
    stakingContract,
    ancUstLpContract,
    connectedWallet,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    HumanAddr,
    CW20Addr,
    ConnectedWallet | undefined,
  ]
>) => {
  return !!connectedWallet
    ? rewardsAncUstLpRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          ancUstLpContract,
          stakingContract,
          lpStakerInfoQuery: {
            staker_info: {
              staker: connectedWallet.walletAddress,
            },
          },
          ancUstLpBalanceQuery: {
            balance: {
              address: connectedWallet.walletAddress,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useRewardsAncUstLpRewardsQuery(): UseQueryResult<
  RewardsAncUstLpRewardsData | undefined
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
      mantleEndpoint,
      mantleFetch,
      anchorToken.staking,
      cw20.AncUstLP,
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
