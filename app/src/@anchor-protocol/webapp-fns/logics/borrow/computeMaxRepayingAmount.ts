import { moneyMarket, u, UST } from '@anchor-protocol/types';
import { max } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { computeRepayTotalBorrowed } from './computeRepayTotalBorrowed';

export function computeMaxRepayingAmount(
  marketState: moneyMarket.market.StateResponse,
  interestModelBorrowRate: moneyMarket.interestModel.BorrowRateResponse,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  currentBlock: number,
  ustBalance: u<UST<BigSource>>,
  fixedGas: u<UST<BigSource>>,
) {
  const totalBorrowed = computeRepayTotalBorrowed(
    marketState,
    interestModelBorrowRate,
    marketBorrowerInfo,
    currentBlock,
  );
  return big(ustBalance).gte(totalBorrowed)
    ? totalBorrowed
    : (max(0, big(ustBalance).minus(big(fixedGas).mul(2))) as u<UST<Big>>);
}
