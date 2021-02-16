import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';

export function repayTxFee(
  repayAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  if (repayAmount.length === 0) {
    return undefined;
  }

  const amount = microfy(repayAmount);
  const txFee = amount.mul(bank.tax.taxRate);

  if (txFee.gt(bank.tax.maxTaxUUSD)) {
    return big(bank.tax.maxTaxUUSD).plus(fixedGas) as uUST<Big>;
  } else {
    return txFee.plus(fixedGas) as uUST<Big>;
  }
}
