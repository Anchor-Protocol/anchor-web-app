import type { u, UST } from '@anchor-protocol/types';
import { moneyMarket } from '@anchor-protocol/types';
import big, { Big } from 'big.js';

export function computeRepayTotalBorrowed(
  marketState: moneyMarket.market.StateResponse,
  interestModelBorrowRate: moneyMarket.interestModel.BorrowRateResponse,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  currentBlock: number,
): u<UST<Big>> {
  const bufferBlocks = 20;

  //- block_height = marketState.ts / currentBlock
  //- global_index = marketState.ts / marketState.global_interest_index
  //- last_interest_updated = marketState.ts / marketState.last_interest_updated
  //- borrowRate = marketOverview.ts / borrowRate.rate
  //- loan_amount = marketUserOverview.ts / loanAmont.loan_amount
  //- interest_index = marketUserOverview.ts / loanAmont.interest_index

  const passedBlock = big(currentBlock).minus(
    marketState.last_interest_updated,
  );
  const interestFactor = passedBlock.mul(interestModelBorrowRate.rate);
  const globalFactorInterestIndex = big(marketState.global_interest_index).mul(
    big(1).plus(interestFactor),
  );
  const bufferInterestFactor = big(interestModelBorrowRate.rate).mul(
    bufferBlocks,
  );
  const totalBorrowsWithoutBuffer = big(marketBorrowerInfo.loan_amount).mul(
    big(globalFactorInterestIndex).div(marketBorrowerInfo.interest_index),
  );
  const totalBorrows = totalBorrowsWithoutBuffer.mul(
    big(1).plus(bufferInterestFactor),
  );

  //console.log('useRepayDialog.tsx..()', totalBorrows.toString(), marketUserOverview.loanAmount.loan_amount);

  return (totalBorrows.lt(1000) ? big(1000) : totalBorrows.plus(1000)) as u<
    UST<Big>
  >;
}
