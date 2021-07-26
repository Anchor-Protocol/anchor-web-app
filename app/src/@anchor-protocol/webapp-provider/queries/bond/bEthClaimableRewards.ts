import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBEthClaimableRewards,
  bondBEthClaimableRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
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
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    bEthRewardContract: HumanAddr,
  ) => {
    return connectedWallet?.walletAddress
      ? bondBEthClaimableRewardsQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            claimableReward: {
              contractAddress: bEthRewardContract,
              query: {
                accrued_rewards: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBondBEthClaimableRewards(): UseQueryResult<
  BondBEthClaimableRewards | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { beth },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      beth.reward,
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
