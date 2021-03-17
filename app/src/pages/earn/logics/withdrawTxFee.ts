import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'base/contexts/bank';

export function withdrawTxFee(
  withdrawAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  if (withdrawAmount.length === 0) return undefined;

  // MIN((Withdrawable(User_input)- Withdrawable(User_input) / (1+Tax_rate)), Max_tax) + Fixed_Gas

  const uustAmount = microfy(withdrawAmount);
  const ratioTxFee = uustAmount.minus(
    uustAmount.div(big(1).add(bank.tax.taxRate)),
  );
  const maxTax = big(bank.tax.maxTaxUUSD);

  if (ratioTxFee.gt(maxTax)) {
    return maxTax.add(fixedGas) as uUST<Big>;
  } else {
    return ratioTxFee.add(fixedGas) as uUST<Big>;
  }
}
