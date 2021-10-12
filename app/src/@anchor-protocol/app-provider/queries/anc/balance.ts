import { HumanAddr } from '@anchor-protocol/types';
import { AncBalance, ancBalanceQuery } from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancBalanceQuery);

export function useAncBalanceQuery(
  walletAddress: HumanAddr | undefined | null,
): UseQueryResult<AncBalance | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_BALANCE,
      walletAddress ?? undefined,
      contractAddress.cw20.ANC,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: !!walletAddress && 1000 * 60 * 2,
      enabled: !!walletAddress,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return walletAddress ? result : EMPTY_QUERY_RESULT;
}
