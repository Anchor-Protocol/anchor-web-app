import { max, min } from '@anchor-protocol/big-math';
import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';

export function depositTxFee(
  depositAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  if (depositAmount.length === 0) return undefined;

  // MIN( MAX((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate, 0 ) , Max_tax) + Fixed_Gas

  const uAmount = microfy(depositAmount);
  const ratioTxFee = big(uAmount.minus(fixedGas))
    .div(big(1).add(bank.tax.taxRate))
    .mul(bank.tax.taxRate);
  const maxTax = big(bank.tax.maxTaxUUSD);

  return max(min(ratioTxFee, maxTax), 0).plus(fixedGas) as uUST<Big>;
}
