import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import { min } from '@libs/big-math';
import big, { Big, BigSource } from 'big.js';
import { AnchorTax } from '../../types';

// Tx_fee = MIN(User_Input/(1+tax_rate) * tax_rate , Max_tax) + Fixed_Gas

export function computeBorrowTxFee(
  borrowAmount: UST,
  tax: AnchorTax,
  fixedGas: uUST<BigSource>,
) {
  if (borrowAmount.length === 0) {
    return undefined;
  }

  const amount = microfy(borrowAmount);

  const userAmountTxFee = big(amount.div(big(1).plus(tax.taxRate))).mul(
    tax.taxRate,
  );

  return min(userAmountTxFee, tax.maxTaxUUSD).plus(fixedGas) as uUST<Big>;
}
