import { AstroportDeposit, astroportDepositQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, HumanAddr, Token } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(astroportDepositQuery);

export function useAstroportDepositQuery<T extends Token>(
  lpTokenAddr: CW20Addr,
  walletAddress?: HumanAddr,
): UseQueryResult<AstroportDeposit<T> | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useApp();

  const { connected, terraWalletAddress } = useAccount();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.ASTROPORT_DEPOSIT,
      walletAddress ?? terraWalletAddress,
      lpTokenAddr,
      contractAddress.astroport.generator,
      queryClient,
    ],
    queryFn as any,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as any;
}
