import { CW20Addr } from '@anchor-protocol/types';
import {
  BorrowCollateralBorrower,
  borrowCollateralBorrowerQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(borrowCollateralBorrowerQuery);

export function useBorrowCollateralBorrowerQuery(
  collateralToken: CW20Addr,
): UseQueryResult<BorrowCollateralBorrower | undefined> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_COLLATERAL_BORROWER,
      connectedWallet?.walletAddress,
      contractAddress.moneyMarket.collateralsArray.find(
        ({ token }) => token === collateralToken,
      )!.custody,
      queryClient,
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
