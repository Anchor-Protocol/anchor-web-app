import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsAncGovernanceRewardsData,
  rewardsAncGovernanceRewardsQuery,
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
    govContract,
    ancContract,
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
    ? rewardsAncGovernanceRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          govContract,
          ancContract,
          govStakeInfoQuery: {
            staker: {
              address: connectedWallet.walletAddress,
            },
          },
          userAncBalanceQuery: {
            balance: {
              address: connectedWallet.walletAddress,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useRewardsAncGovernanceRewardsQuery(): UseQueryResult<
  RewardsAncGovernanceRewardsData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { anchorToken, cw20 },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_ANC_GOVERNANCE_REWARDS,
      mantleEndpoint,
      mantleFetch,
      anchorToken.gov,
      cw20.ANC,
      connectedWallet,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
