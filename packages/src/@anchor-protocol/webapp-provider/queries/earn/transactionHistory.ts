import {
  ANCHOR_QUERY_KEY,
  EarnTransactionHistoryData,
  earnTransactionHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useEarnTransactionHistoryQuery(): UseQueryResult<
  EarnTransactionHistoryData | undefined
> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const connectedWallet = useConnectedWallet();

  const queryFn = useCallback(() => {
    return connectedWallet?.walletAddress
      ? earnTransactionHistoryQuery({
          mantleEndpoint,
          mantleFetch,
          variables: {
            walletAddress: connectedWallet.walletAddress,
          },
        })
      : Promise.resolve({ transactionHistory: [] });
  }, [connectedWallet, mantleEndpoint, mantleFetch]);

  return useQuery(ANCHOR_QUERY_KEY.EARN_TRANSACTION_HISTORY, queryFn, {
    enabled: !browserInactive && !!connectedWallet,
    keepPreviousData: true,
  });
}
