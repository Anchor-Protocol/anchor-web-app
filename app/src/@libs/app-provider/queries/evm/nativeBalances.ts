import { evmNativeBalancesQuery, ZERO_ETH_BALANCE } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { EVM_QUERY_KEY, REFETCH_INTERVAL } from '../../env';
import { EVMAddr, u } from '../../../types';
import { Eth } from '../../../../@anchor-protocol/types';
import { useEvmWallet } from '../../../evm-wallet';
import { BigNumber } from '@ethersproject/bignumber';

const queryFn = createQueryFn(evmNativeBalancesQuery);

export function useEvmNativeBalanceQuery(
  walletAddress?: EVMAddr,
): UseQueryResult<u<Eth> | undefined> {
  const { queryErrorReporter } = useApp();

  const { address, provider } = useEvmWallet();

  return useQuery(
    [
      EVM_QUERY_KEY.EVM_NATIVE_BALANCES,
      walletAddress ?? (address as EVMAddr),
      (walletAddress: EVMAddr): Promise<BigNumber> | undefined => {
        if (!provider) {
          return;
        }
        return provider.getBalance(walletAddress);
      },
    ],
    queryFn,
    {
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}

export function useEvmNativeBalance(walletAddress?: EVMAddr): u<Eth> {
  const { data: nativeBalance = ZERO_ETH_BALANCE } =
    useEvmNativeBalanceQuery(walletAddress);

  return nativeBalance;
}
