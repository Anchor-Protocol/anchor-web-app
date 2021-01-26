import { Num, Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useBorrowed(
  loanAmount: uUST<BigSource> | undefined,
  borrowRate: Ratio<BigSource> | undefined,
  currentBlock: number | undefined,
  lastInterestUpdated: number | undefined,
  globalInterestIndex: Num<BigSource> | undefined,
  interestIndex: Num<BigSource> | undefined,
): uUST<Big> {
  return useMemo(() => {
    if (
      !loanAmount ||
      !borrowRate ||
      !currentBlock ||
      !lastInterestUpdated ||
      !globalInterestIndex ||
      !interestIndex
    ) {
      return big('0') as uUST<Big>;
    }

    const passedBlock = big(currentBlock).minus(lastInterestUpdated);
    const interestFactor = passedBlock.mul(borrowRate);
    const globalFactorInterestIndex = big(globalInterestIndex).mul(
      big(1).plus(interestFactor),
    );
    return big(loanAmount).mul(
      big(globalFactorInterestIndex).div(interestIndex),
    ) as uUST<Big>;
  }, [
    borrowRate,
    currentBlock,
    globalInterestIndex,
    interestIndex,
    lastInterestUpdated,
    loanAmount,
  ]);
}
