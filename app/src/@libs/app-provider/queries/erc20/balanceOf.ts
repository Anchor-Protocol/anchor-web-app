import { useQuery, UseQueryResult } from 'react-query';
import { useEvmWallet } from '@libs/evm-wallet';
import { createQueryFn } from '@libs/react-query-utils';
import { ERC20Addr, EVMAddr, Token, u } from '@libs/types';
import { useAccount } from 'contexts/account';
import { useApp } from '../../contexts/app';
import { EVM_QUERY_KEY, REFETCH_INTERVAL } from '../../env';
import { erc2020BalanceQuery } from '../../../app-fns/queries/erc20/balanceOf';
import { useEvmCrossAnchorSdk } from 'crossanchor';

const queryFn = createQueryFn(erc2020BalanceQuery);

export function useERC20BalanceQuery<T extends Token>(
  tokenAddress: ERC20Addr | undefined,
  walletAddress: EVMAddr | undefined,
): UseQueryResult<T | undefined> {
  const { queryErrorReporter } = useApp();

  const { nativeWalletAddress } = useAccount();
  const { provider } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  return useQuery(
    [
      EVM_QUERY_KEY.ERC20_BALANCE,
      tokenAddress,
      walletAddress ?? nativeWalletAddress,
      (
        tokenAddress: ERC20Addr,
        walletAddress: EVMAddr,
      ): Promise<string> | undefined => {
        if (!provider) {
          return;
        }

        return xAnchor.balance(tokenAddress, walletAddress);
      },
    ],
    queryFn as any,
    {
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}

export function useERC20Balance<T extends Token>(
  tokenAddress: ERC20Addr | undefined,
  walletAddress?: EVMAddr | undefined,
): u<T> {
  const { data: balance } = useERC20BalanceQuery<T>(
    tokenAddress,
    walletAddress,
  );

  return balance ? (balance as u<T>) : ('0' as u<T>);
}
