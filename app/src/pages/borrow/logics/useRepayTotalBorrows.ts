import { Num, Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export function useRepayTotalBorrows(
  loanAmount: uUST<BigSource>,
  borrowRate: Ratio<BigSource>,
  currentBlock: number,
  lastInterestUpdated: number,
  globalInterestIndex: Num<BigSource>,
  interestIndex: Num<BigSource>,
): uUST<Big> {
  const bufferBlocks = 20;

  //- block_height = marketBalanceOverview.ts / currentBlock
  //- global_index = marketBalanceOverview.ts / marketState.global_interest_index
  //- last_interest_updated = marketBalanceOverview.ts / marketState.last_interest_updated
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

  return (totalBorrows.lt(100)
    ? big(100)
    : totalBorrows.plus(100)) as uUST<Big>;
}
