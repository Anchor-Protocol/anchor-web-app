import {
  EarnTransactionHistoryData,
  earnTransactionHistoryQuery,
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
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    connectedWallet: ConnectedWallet | undefined,
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
  ) => {
    return connectedWallet?.walletAddress
      ? earnTransactionHistoryQuery({
          mantleEndpoint,
          mantleFetch,
          variables: {
            walletAddress: connectedWallet.walletAddress,
          },
        })
      : Promise.resolve({ transactionHistory: [] });
  },
);

export function useEarnTransactionHistoryQuery(): UseQueryResult<
  EarnTransactionHistoryData | undefined
> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

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
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
