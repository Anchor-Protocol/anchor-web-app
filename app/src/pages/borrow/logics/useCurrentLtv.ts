import { Ratio, uUST } from '@anchor-protocol/notation';
import { Big, BigSource } from 'big.js';
import { currentLtv } from 'pages/borrow/logics/currentLtv';
import { useMemo } from 'react';

export function useCurrentLtv(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
): Ratio<Big> | undefined {
  // loan_amount / ( (borrow_info.balance - borrow_info.spendable) * oracle_price )
  return useMemo(
    () => currentLtv(loanAmount, balance, spendable, oraclePrice),
    [balance, loanAmount, oraclePrice, spendable],
  );
}
