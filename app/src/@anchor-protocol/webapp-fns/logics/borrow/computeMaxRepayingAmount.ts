import { moneyMarket, uUST } from '@anchor-protocol/types';
import { computeRepayTotalBorrowed } from './computeRepayTotalBorrowed';
import { max } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';

export function computeMaxRepayingAmount(
  marketState: moneyMarket.market.StateResponse,
  interestModelBorrowRate: moneyMarket.interestModel.BorrowRateResponse,
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse,
  currentBlock: number,
  ustBalance: uUST<BigSource>,
  fixedGas: uUST<BigSource>,
) {
  const totalBorrowed = computeRepayTotalBorrowed(
    marketState,
    interestModelBorrowRate,
    marketBorrowerInfo,
    currentBlock,
  );
  return big(ustBalance).gte(totalBorrowed)
    ? totalBorrowed
    : (max(0, big(ustBalance).minus(big(fixedGas).mul(2))) as uUST<Big>);
}
