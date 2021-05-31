import { HumanAddr } from '@anchor-protocol/types';
import {
  BorrowBorrowerData,
  borrowBorrowerQuery,
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
  queryKey: [
    ,
    mantleEndpoint,
    mantleFetch,
    connectedWallet,
    lastSyncedHeight,
    marketContract,
    custodyContract,
  ],
}: QueryFunctionContext<
  [
    string,
    string,
    MantleFetch,
    ConnectedWallet | undefined,
    () => Promise<number>,
    HumanAddr,
    HumanAddr,
  ]
>) => {
  return !!connectedWallet
    ? borrowBorrowerQuery({
        mantleEndpoint,
        mantleFetch,
        lastSyncedHeight,
        variables: {
          marketContract,
          marketBorrowerInfoQuery: {
            borrower_info: {
              borrower: connectedWallet.walletAddress,
              block_height: -1,
            },
          },
          custodyContract,
          custodyBorrowerQuery: {
            borrower: {
              address: connectedWallet.walletAddress,
            },
          },
        },
      })
    : Promise.resolve(undefined);
};

export function useBorrowBorrowerQuery(): UseQueryResult<
  BorrowBorrowerData | undefined
> {
  const connectedWallet = useConnectedWallet();

  const {
    mantleFetch,
    mantleEndpoint,
    lastSyncedHeight,
    queryErrorReporter,
  } = useTerraWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_BORROWER,
      mantleEndpoint,
      mantleFetch,
      connectedWallet,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.custody,
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
