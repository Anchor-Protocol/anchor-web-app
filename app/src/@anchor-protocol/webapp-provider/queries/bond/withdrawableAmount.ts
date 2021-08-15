import { HumanAddr } from '@anchor-protocol/types';
import {
  BondWithdrawableAmount,
  bondWithdrawableAmountQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
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
    bLunaHubContract: HumanAddr,
  ) => {
    return connectedWallet?.walletAddress
      ? bondWithdrawableAmountQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            withdrawableUnbonded: {
              contractAddress: bLunaHubContract,
              query: {
                withdrawable_unbonded: {
                  block_time: Math.floor(Date.now() / 1000),
                  address: connectedWallet.walletAddress,
                },
              },
            },
            unbondedRequests: {
              contractAddress: bLunaHubContract,
              query: {
                unbond_requests: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
            allHistory: {
              contractAddress: bLunaHubContract,
              query: {
                all_history: {
                  start_from: -1,
                  limit: 100,
                },
              },
            },
            parameters: {
              contractAddress: bLunaHubContract,
              query: {
                parameters: {},
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBondWithdrawableAmount(): UseQueryResult<
  BondWithdrawableAmount | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { bluna },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_WITHDRAWABLE_AMOUNT,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      bluna.hub,
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
