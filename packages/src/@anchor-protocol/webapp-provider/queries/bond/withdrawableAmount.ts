import { HumanAddr } from '@anchor-protocol/types';
import {
  BondWithdrawableAmountData,
  bondWithdrawableAmountQuery,
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
  queryKey: [, mantleEndpoint, mantleFetch, connectedWallet, bLunaHubContract],
}: QueryFunctionContext<
  [string, string, MantleFetch, ConnectedWallet | undefined, HumanAddr]
>) => {
  return connectedWallet?.walletAddress
    ? bondWithdrawableAmountQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          bLunaHubContract,
          withdrawableUnbondedQuery: {
            withdrawable_unbonded: {
              block_time: Math.floor(Date.now() / 1000),
              address: connectedWallet.walletAddress,
            },
          },
          unbondedRequestsQuery: {
            unbond_requests: {
              address: connectedWallet.walletAddress,
            },
          },
          allHistoryQuery: {
            all_history: {
              start_from: -1,
              limit: 100,
            },
          },
          parametersQuery: {
            parameters: {},
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useBondWithdrawableAmount(): UseQueryResult<
  BondWithdrawableAmountData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { bluna },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

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
      refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
