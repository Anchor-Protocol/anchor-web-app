import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Bank } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { useMemo } from 'react';

export function useBorrowTxFee(borrowAmount: UST, bank: Bank) {
  return useMemo<uUST<Big> | undefined>(() => {
    if (borrowAmount.length === 0) {
      return undefined;
    }

    const amount = microfy(borrowAmount);

    const userAmountTxFee = big(
      amount.minus(amount).div(big(1).plus(bank.tax.taxRate)),
    ).mul(bank.tax.taxRate);

    if (userAmountTxFee.gt(bank.tax.maxTaxUUSD)) {
      return big(bank.tax.maxTaxUUSD).plus(FIXED_GAS) as uUST<Big>;
    } else {
      return userAmountTxFee.plus(FIXED_GAS) as uUST<Big>;
    }
  }, [borrowAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);
}
