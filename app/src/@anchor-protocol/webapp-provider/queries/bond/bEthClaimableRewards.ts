import { HumanAddr } from '@anchor-protocol/types';
import {
  BondBEthClaimableRewards,
  bondBEthClaimableRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch } from '@libs/webapp-fns';
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
    connectedWallet: ConnectedWallet | undefined,
    bEthRewardContract: HumanAddr,
  ) => {
    return connectedWallet?.walletAddress
      ? bondBEthClaimableRewardsQuery(
          bEthRewardContract,
          connectedWallet.walletAddress,
          mantleEndpoint,
          mantleFetch,
        )
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
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
