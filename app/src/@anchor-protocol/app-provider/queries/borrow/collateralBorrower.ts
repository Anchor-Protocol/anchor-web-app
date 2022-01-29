import { CW20Addr } from '@anchor-protocol/types';
import {
  BorrowCollateralBorrower,
  borrowCollateralBorrowerQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(borrowCollateralBorrowerQuery);

export function useBorrowCollateralBorrowerQuery(
  collateralToken: CW20Addr,
): UseQueryResult<BorrowCollateralBorrower | undefined> {
  const { connected, terraWalletAddress } = useAccount();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_COLLATERAL_BORROWER,
      terraWalletAddress,
      contractAddress.moneyMarket.collateralsArray.find(
        ({ token }) => token === collateralToken,
      )!.custody,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connected ? result : EMPTY_QUERY_RESULT;
}
