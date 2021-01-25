import { Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

export function useBorrowMax(
  loanAmount: uUST<BigSource>,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaMaxLtv: Ratio<BigSource>,
): uUST<Big> {
  return useMemo<uUST<Big>>(() => {
    return big(bLunaMaxLtv)
      .mul(big(balance).minus(spendable))
      .mul(oraclePrice)
      .minus(loanAmount) as uUST<Big>;
  }, [bLunaMaxLtv, balance, loanAmount, oraclePrice, spendable]);
}
