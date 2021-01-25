import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Bank } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { useMemo } from 'react';

export function useRepayTxFee(
  repayAmount: UST,
  bank: Bank,
): uUST<Big> | undefined {
  return useMemo<uUST<Big> | undefined>(() => {
    if (repayAmount.length === 0) {
      return undefined;
    }

    const amount = microfy(repayAmount);
    const txFee = amount.mul(bank.tax.taxRate);

    if (txFee.gt(bank.tax.maxTaxUUSD)) {
      return big(bank.tax.maxTaxUUSD).plus(FIXED_GAS) as uUST<Big>;
    } else {
      return txFee.plus(FIXED_GAS) as uUST<Big>;
    }
  }, [repayAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);
}
