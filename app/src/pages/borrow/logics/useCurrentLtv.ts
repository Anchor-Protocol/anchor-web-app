import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useCurrentLtv(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
): Ratio<Big> | undefined {
  // loan_amount / ( (borrow_info.balance - borrow_info.spendable) * oracle_price )
  return useMemo(() => {
    try {
      return big(loanAmount).div(
        big(big(balance).minus(spendable)).mul(oraclePrice),
      ) as Ratio<Big>;
    } catch {
      return undefined;
    }
  }, [balance, loanAmount, oraclePrice, spendable]);
}
