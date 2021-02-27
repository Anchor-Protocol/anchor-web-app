import type { Num, Rate, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export function repayTotalBorrows(
  loanAmount: uUST<BigSource>,
  borrowRate: Rate<BigSource>,
  currentBlock: number,
  lastInterestUpdated: number,
  globalInterestIndex: Num<BigSource>,
  interestIndex: Num<BigSource>,
): uUST<Big> {
  const bufferBlocks = 20;

  //- block_height = marketState.ts / currentBlock
  //- global_index = marketState.ts / marketState.global_interest_index
  //- last_interest_updated = marketState.ts / marketState.last_interest_updated
  //- borrowRate = marketOverview.ts / borrowRate.rate
  //- loan_amount = marketUserOverview.ts / loanAmont.loan_amount
  //- interest_index = marketUserOverview.ts / loanAmont.interest_index

  const passedBlock = big(currentBlock).minus(lastInterestUpdated);
  const interestFactor = passedBlock.mul(borrowRate);
  const globalFactorInterestIndex = big(globalInterestIndex).mul(
    big(1).plus(interestFactor),
  );
  const bufferInterestFactor = big(borrowRate).mul(bufferBlocks);
  const totalBorrowsWithoutBuffer = big(loanAmount).mul(
    big(globalFactorInterestIndex).div(interestIndex),
  );
  const totalBorrows = totalBorrowsWithoutBuffer.mul(
    big(1).plus(bufferInterestFactor),
  );

  //console.log('useRepayDialog.tsx..()', totalBorrows.toString(), marketUserOverview.loanAmount.loan_amount);

  return (totalBorrows.lt(1000)
    ? big(1000)
    : totalBorrows.plus(1000)) as uUST<Big>;
}
