import {
  EarnTransactionHistoryData,
  earnTransactionHistoryQuery,
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
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = ({
  queryKey: [, connectedWallet, mantleEndpoint, mantleFetch],
}: QueryFunctionContext<
  [string, ConnectedWallet | undefined, string, MantleFetch]
>) => {
  return connectedWallet?.walletAddress
    ? earnTransactionHistoryQuery({
        mantleEndpoint,
        mantleFetch,
        variables: {
          walletAddress: connectedWallet.walletAddress,
        },
      })
    : Promise.resolve({ transactionHistory: [] });
};

export function useEarnTransactionHistoryQuery(): UseQueryResult<
  EarnTransactionHistoryData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.EARN_TRANSACTION_HISTORY,
      connectedWallet,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      enabled: !browserInactive && !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
