import { ERC20Addr, EVMAddr, Token, u } from '@libs/types';
import { BigNumber } from '@ethersproject/bignumber';

export type BalanceOfFetcher = (
  tokenAddress: ERC20Addr,
  walletAddress: EVMAddr,
) => Promise<BigNumber>;

export async function erc2020BalanceQuery<T extends Token>(
  tokenAddress: ERC20Addr | undefined,
  walletAddress: EVMAddr | undefined,
  fetcher: BalanceOfFetcher,
): Promise<T | undefined> {
  if (!walletAddress || !tokenAddress || !fetcher) {
    return;
  }

  const balance: BigNumber | undefined = await fetcher(
    tokenAddress,
    walletAddress,
  );

  if (!balance) {
    return;
  }

  return balance.toString() as u<T>;
}
