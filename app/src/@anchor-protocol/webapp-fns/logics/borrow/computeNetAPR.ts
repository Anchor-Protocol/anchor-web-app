import { Rate } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { BorrowAPYData } from '../../queries/borrow/apy';

export function computeNetAPR(
  borrowerDistributionAPYs:
    | BorrowAPYData['borrowerDistributionAPYs']
    | undefined,
  borrowAPR: Rate<BigSource>,
): Rate<BigSource> {
  return borrowerDistributionAPYs && borrowerDistributionAPYs.length > 0
    ? (big(borrowerDistributionAPYs[0].DistributionAPY).minus(
        borrowAPR,
      ) as Rate<Big>)
    : (0 as Rate<number>);
}
