import { BigNumber } from '@ethersproject/bignumber';
import { u } from '../../../types';
import { Eth } from '../../../../@anchor-protocol/types';

export const ZERO_ETH_BALANCE = '0' as u<Eth>;

export async function evmNativeBalancesQuery(
  walletAddress: string | undefined,
  fetcher: any,
): Promise<u<Eth>> {
  console.log(walletAddress, fetcher);
  if (!walletAddress || !fetcher) {
    return ZERO_ETH_BALANCE;
  }

  const balance: BigNumber = await fetcher(walletAddress);

  return balance.toString() as u<Eth>;
}
