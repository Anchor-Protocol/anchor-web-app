import { HumanAddr } from '@anchor-protocol/types';
import {
  BorrowBorrower,
  borrowBorrowerQuery,
} from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import {
  EMPTY_QUERY_RESULT,
  MantleFetch,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    connectedWallet: ConnectedWallet | undefined,
    lastSyncedHeight: () => Promise<number>,
    marketContract: HumanAddr,
    overseerContract: HumanAddr,
  ) => {
    return !!connectedWallet
      ? borrowBorrowerQuery({
          mantleEndpoint,
          mantleFetch,
          lastSyncedHeight,
          wasmQuery: {
            marketBorrowerInfo: {
              contractAddress: marketContract,
              query: {
                borrower_info: {
                  borrower: connectedWallet.walletAddress,
                  block_height: -1,
                },
              },
            },
            overseerCollaterals: {
              contractAddress: overseerContract,
              query: {
                collaterals: {
                  borrower: connectedWallet.walletAddress,
                },
              },
            },
            overseerBorrowLimit: {
              contractAddress: overseerContract,
              query: {
                borrow_limit: {
                  borrower: connectedWallet.walletAddress,
                  block_time: -1,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useBorrowBorrowerQuery(): UseQueryResult<
  BorrowBorrower | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight, queryErrorReporter } =
    useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_BORROWER,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.overseer,
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
