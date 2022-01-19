import { evmNativeBalancesQuery, ZERO_ETH_BALANCE } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { EVM_QUERY_KEY } from '../../env';
import { useEvmWallet } from '../../../web3-react';
import { u } from '../../../types';
import { Eth } from '../../../../@anchor-protocol/types';

const queryFn = createQueryFn(evmNativeBalancesQuery);

export function useEvmNativeBalanceQuery(
  walletAddress?: string,
): UseQueryResult<u<Eth> | undefined> {
  const { queryErrorReporter } = useApp();

  const { address, provider } = useEvmWallet();

  return useQuery(
    [
      EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
      walletAddress ?? address,
      (walletAddress: string) => {
        if (!provider) {
          return;
        }
        return provider.getBalance(walletAddress);
      },
    ],
    queryFn,
    {
      refetchInterval: !!provider && 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
      placeholderData: () => ZERO_ETH_BALANCE,
    },
  );
}

export function useEvmNativeBalance(walletAddress?: string): u<Eth> {
  const { data: nativeBalance = ZERO_ETH_BALANCE } =
    useEvmNativeBalanceQuery(walletAddress);

  return nativeBalance;
}
