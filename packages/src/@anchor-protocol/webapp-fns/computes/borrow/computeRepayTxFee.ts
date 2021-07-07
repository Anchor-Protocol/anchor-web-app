import { microfy } from '@anchor-protocol/notation';
import type { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { AnchorTax } from '../../types';

export function computeRepayTxFee(
  repayAmount: UST,
  tax: AnchorTax,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  if (repayAmount.length === 0) {
    return undefined;
  }

  const amount = microfy(repayAmount);
  const txFee = amount.mul(tax.taxRate);

  if (txFee.gt(tax.maxTaxUUSD)) {
    return big(tax.maxTaxUUSD).plus(fixedGas) as uUST<Big>;
  } else {
    return txFee.plus(fixedGas) as uUST<Big>;
  }
}
