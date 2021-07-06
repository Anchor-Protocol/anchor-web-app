import { min } from '@terra-dev/big-math';
import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';

// Tx_fee = MIN(User_Input/(1+tax_rate) * tax_rate , Max_tax) + Fixed_Gas

export function borrowTxFee(
  borrowAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
) {
  if (borrowAmount.length === 0) {
    return undefined;
  }

  const amount = microfy(borrowAmount);

  const userAmountTxFee = big(amount.div(big(1).plus(bank.tax.taxRate))).mul(
    bank.tax.taxRate,
  );

  return min(userAmountTxFee, bank.tax.maxTaxUUSD).plus(fixedGas) as uUST<Big>;
}
