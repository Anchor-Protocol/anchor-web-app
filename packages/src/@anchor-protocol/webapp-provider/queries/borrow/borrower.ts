import {
  ANCHOR_QUERY_KEY,
  BorrowBorrowerData,
  borrowBorrowerQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
import { useCallback } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export function useBorrowBorrowerQuery(): UseQueryResult<
  BorrowBorrowerData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const queryFn = useCallback(() => {
    return !!connectedWallet
      ? () =>
          borrowBorrowerQuery({
            mantleEndpoint,
            mantleFetch,
            lastSyncedHeight,
            variables: {
              marketContract: moneyMarket.market,
              marketBorrowerInfoQuery: {
                borrower_info: {
                  borrower: connectedWallet.walletAddress,
                  block_height: -1,
                },
              },
              custodyContract: moneyMarket.custody,
              custodyBorrowerQuery: {
                borrower: {
                  address: connectedWallet.walletAddress,
                },
              },
            },
          })
      : () => Promise.resolve(EMPTY_QUERY_RESULT);
  }, [
    connectedWallet,
    lastSyncedHeight,
    mantleEndpoint,
    mantleFetch,
    moneyMarket.custody,
    moneyMarket.market,
  ]);

  return useQuery(ANCHOR_QUERY_KEY.BORROW_BORROWER, queryFn, {
    refetchInterval: browserInactive && !!connectedWallet && 1000 * 60 * 5,
    enabled: !browserInactive && !!connectedWallet,
    keepPreviousData: true,
  });
}
