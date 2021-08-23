import type { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import big, { Big, BigSource } from 'big.js';
import { AnchorTax } from '../../types';

export function computeRepayTxFee(
  repayAmount: UST,
  tax: AnchorTax,
  fixedGas: u<UST<BigSource>>,
): u<UST<Big>> | undefined {
  if (repayAmount.length === 0) {
    return undefined;
  }

  const amount = microfy(repayAmount);
  const txFee = amount.mul(tax.taxRate);

  if (txFee.gt(tax.maxTaxUUSD)) {
    return big(tax.maxTaxUUSD).plus(fixedGas) as u<UST<Big>>;
  } else {
    return txFee.plus(fixedGas) as u<UST<Big>>;
  }
}
