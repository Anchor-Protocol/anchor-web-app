import { createQueryFn } from '@libs/react-query-utils';
import { ERC20Addr, EVMAddr, Token, u } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { EVM_QUERY_KEY, REFETCH_INTERVAL } from '../../env';
import { erc2020BalanceQuery } from '../../../app-fns/queries/erc20/balanceOf';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { useEvmWallet } from '../../../web3';
import ERC20ABI from '../../../../abi/erc20.json';

const queryFn = createQueryFn(erc2020BalanceQuery);

export function useERC20BalanceQuery<T extends Token>(
  tokenAddress: EVMAddr | undefined,
  walletAddress?: ERC20Addr | undefined,
): UseQueryResult<T | undefined> {
  const { queryErrorReporter } = useApp();

  const { address, provider } = useEvmWallet();

  return useQuery(
    [
      EVM_QUERY_KEY.ERC20_BALANCE,
      tokenAddress,
      walletAddress ?? (address as EVMAddr),
      (
        tokenAddress: EVMAddr,
        walletAddress: ERC20Addr,
      ): Promise<BigNumber> | undefined => {
        if (!provider) {
          return;
        }

        // TODO: Use Factory in future
        const contract = new Contract(tokenAddress, ERC20ABI, provider);
        return contract.balanceOf(walletAddress);
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
  tokenAddress: EVMAddr | undefined,
  walletAddress?: ERC20Addr | undefined,
): u<T> {
  const { data: balance } = useERC20BalanceQuery<T>(
    tokenAddress,
    walletAddress,
  );

  return balance as u<T>;
}
