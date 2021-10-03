import {
  BondWithdrawableAmount,
  bondWithdrawableAmountQuery,
} from '@anchor-protocol/webapp-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondWithdrawableAmountQuery);

export function useBondWithdrawableAmount(): UseQueryResult<
  BondWithdrawableAmount | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_WITHDRAWABLE_AMOUNT,
      connectedWallet?.walletAddress,
      contractAddress.bluna.hub,
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
