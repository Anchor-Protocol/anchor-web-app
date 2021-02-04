import { min } from '@anchor-protocol/big-math';
import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { useMemo } from 'react';

// Tx_fee = MIN(User_Input/(1+tax_rate) * tax_rate , Max_tax) + Fixed_Gas

export function useBorrowTxFee(
  borrowAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
) {
  return useMemo<uUST<Big> | undefined>(() => {
    if (borrowAmount.length === 0) {
      return undefined;
    }

    const amount = microfy(borrowAmount);

    const userAmountTxFee = big(amount.div(big(1).plus(bank.tax.taxRate))).mul(
      bank.tax.taxRate,
    );

    return min(userAmountTxFee, bank.tax.maxTaxUUSD).plus(
      fixedGas,
    ) as uUST<Big>;
  }, [borrowAmount, bank.tax.taxRate, bank.tax.maxTaxUUSD, fixedGas]);
}
