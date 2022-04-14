import { useQuery, UseQueryResult } from 'react-query';
import { useEvmWallet } from '@libs/evm-wallet';
import { EVM_QUERY_KEY, REFETCH_INTERVAL, useApp } from '@libs/app-provider';
import { HumanAddr, Token, u } from '@libs/types';

export function useEvmNativeBalanceQuery(
  walletAddress?: HumanAddr,
): UseQueryResult<u<Token> | undefined> {
  const { queryErrorReporter } = useApp();
  const { provider } = useEvmWallet();

  return useQuery(
    [EVM_QUERY_KEY.EVM_NATIVE_BALANCES, provider, walletAddress],
    () => {
      if (walletAddress === undefined || provider === undefined) {
        return;
      }

      return provider.getBalance(walletAddress);
    },
    {
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
