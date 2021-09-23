import { CW20Addr, HumanAddr } from '@anchor-protocol/types';
import {
  RewardsAncGovernanceRewards,
  rewardsAncGovernanceRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { MantleFetch } from '@libs/mantle';
import { createQueryFn } from '@libs/react-query-utils';
import { EMPTY_QUERY_RESULT, useTerraWebapp } from '@libs/webapp-provider';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    govContract: HumanAddr,
    ancContract: CW20Addr,
    connectedWallet: ConnectedWallet | undefined,
  ) => {
    return !!connectedWallet
      ? rewardsAncGovernanceRewardsQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            userGovStakingInfo: {
              contractAddress: govContract,
              query: {
                staker: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
            userANCBalance: {
              contractAddress: ancContract,
              query: {
                balance: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useRewardsAncGovernanceRewardsQuery(): UseQueryResult<
  RewardsAncGovernanceRewards | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const {
    contractAddress: { anchorToken, cw20 },
  } = useAnchorWebapp();

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
      refetchInterval: 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
