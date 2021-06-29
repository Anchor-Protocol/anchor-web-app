import { HumanAddr } from '@anchor-protocol/types';
import {
  BondClaimableRewards,
  bondClaimableRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch } from '@terra-money/webapp-fns';
import {
  EMPTY_QUERY_RESULT,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { QueryFunctionContext, useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [
    ,
    { mantleEndpoint, mantleFetch, connectedWallet, bAssetRewardContract },
  ],
}: QueryFunctionContext<
  [
    string,
    {
      mantleEndpoint: string;
      mantleFetch: MantleFetch;
      connectedWallet: ConnectedWallet | undefined;
      bAssetRewardContract: HumanAddr;
    },
  ]
>) => {
  return connectedWallet?.walletAddress
    ? bondClaimableRewardsQuery({
        mantleEndpoint,
        mantleFetch,
        wasmQuery: {
          rewardState: {
            contractAddress: bAssetRewardContract,
            query: {
              state: {},
            },
          },
          claimableReward: {
            contractAddress: bAssetRewardContract,
            query: {
              holder: {
                address: connectedWallet.walletAddress,
              },
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useBondClaimableRewards(): UseQueryResult<
  BondClaimableRewards | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { bluna },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_CLAIMABLE_REWARDS,
      {
        mantleEndpoint,
        mantleFetch,
        connectedWallet,
        bAssetRewardContract: bluna.reward,
      },
    ],
    queryFn,
    {
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
