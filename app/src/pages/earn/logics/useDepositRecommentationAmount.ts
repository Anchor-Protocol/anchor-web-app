import { min } from '@anchor-protocol/big-math';
import { uUST } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { BankState } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { useMemo } from 'react';

export function useDepositRecommentationAmount(
  bank: BankState,
): uUST<Big> | undefined {
  return useMemo(() => {
    if (bank.status === 'demo' || big(bank.userBalances.uUSD).lte(0)) {
      return undefined;
    }

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas
    // without_fixed_gas = (uusd balance - fixed_gas)
    // tax_fee = without_fixed_gas * tax_rate
    // without_tax_fee = if (tax_fee < max_tax) without_fixed_gas - tax_fee
    //                   else without_fixed_gas - max_tax

    const userUUSD = big(bank.userBalances.uUSD);
    const withoutFixedGas = userUUSD.minus(FIXED_GAS);
    const txFee = withoutFixedGas.mul(bank.tax.taxRate);
    const result = withoutFixedGas.minus(min(txFee, bank.tax.maxTaxUUSD));

    return result.lte(0) ? undefined : (result.minus(FIXED_GAS) as uUST<Big>);
  }, [
    bank.status,
    bank.tax.maxTaxUUSD,
    bank.tax.taxRate,
    bank.userBalances.uUSD,
  ]);
}
