import { BigNumber } from '@ethersproject/bignumber';
import { EVMAddr, u } from '../../../types';
import { Eth } from '../../../../@anchor-protocol/types';

export const ZERO_ETH_BALANCE = '0' as u<Eth>;

export type NativeBalanceFetcher = (
  walletAddress: EVMAddr,
) => Promise<BigNumber> | undefined;

export async function evmNativeBalancesQuery(
  walletAddress: EVMAddr | undefined,
  fetcher: NativeBalanceFetcher,
): Promise<u<Eth> | undefined> {
  if (!walletAddress || !fetcher) {
    return ZERO_ETH_BALANCE;
  }

  const balance: BigNumber | undefined = await fetcher(walletAddress);

  if (!balance) {
    return;
  }

  return balance.toString() as u<Eth>;
}
