import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { HumanAddr } from '@anchor-protocol/types';
import {
  BondClaimableRewards,
  bondClaimableRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { MantleFetch } from '@terra-money/webapp-fns';
import {
  EMPTY_QUERY_RESULT,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    bAssetRewardContract: HumanAddr,
  ) => {
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
  },
);

export function useBondClaimableRewards(
  rewardDenom: COLLATERAL_DENOMS,
): UseQueryResult<BondClaimableRewards | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { bluna, beth },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_CLAIMABLE_REWARDS,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      rewardDenom === COLLATERAL_DENOMS.UBETH ? beth.reward : bluna.reward,
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
