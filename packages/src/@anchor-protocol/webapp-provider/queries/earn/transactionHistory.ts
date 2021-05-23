import {
  ANCHOR_QUERY_KEY,
  EarnTransactionHistoryData,
  earnTransactionHistoryQuery,
} from '@anchor-protocol/webapp-fns';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useCallback, useRef } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useEarnTransactionHistoryQuery(): UseQueryResult<
  EarnTransactionHistoryData | undefined
> {
  const firstLoad = useRef<boolean>(true);

  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const connectedWallet = useConnectedWallet();

  const queryFn = useCallback(() => {
    return connectedWallet?.walletAddress
      ? delay(firstLoad.current ? 0 : 1000 * 3).then(() => {
          firstLoad.current = false;
          return earnTransactionHistoryQuery({
            mantleEndpoint,
            mantleFetch,
            variables: {
              walletAddress: connectedWallet.walletAddress,
            },
          });
        })
      : Promise.resolve({ transactionHistory: [] });
  }, [connectedWallet, mantleEndpoint, mantleFetch]);

  return useQuery(ANCHOR_QUERY_KEY.EARN_TRANSACTION_HISTORY, queryFn, {
    enabled: !browserInactive && !!connectedWallet,
    keepPreviousData: true,
  });
}
