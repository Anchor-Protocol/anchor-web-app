import { min } from '@terra-dev/big-math';
import type { uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'base/contexts/bank';

export function depositRecommendationAmount(
  bank: Bank,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  if (big(bank.userBalances.uUSD).lte(0)) {
    return undefined;
  }

  // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas
  // without_fixed_gas = (uusd balance - fixed_gas)
  // tax_fee = without_fixed_gas * tax_rate
  // without_tax_fee = if (tax_fee < max_tax) without_fixed_gas - tax_fee
  //                   else without_fixed_gas - max_tax

  const userUUSD = big(bank.userBalances.uUSD);
  const withoutFixedGas = userUUSD.minus(fixedGas);
  const txFee = withoutFixedGas.mul(bank.tax.taxRate);
  const result = withoutFixedGas.minus(min(txFee, bank.tax.maxTaxUUSD));

  return result.minus(fixedGas).lte(0)
    ? undefined
    : (result.minus(fixedGas) as uUST<Big>);
}
