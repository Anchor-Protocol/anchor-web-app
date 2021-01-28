import { max, min } from '@anchor-protocol/big-math';
import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Bank } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { useMemo } from 'react';

export function useDepositTxFee(
  depositAmount: UST,
  bank: Bank,
): uUST<Big> | undefined {
  return useMemo(() => {
    if (depositAmount.length === 0) return undefined;

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas

    const uAmount = microfy(depositAmount);
    const ratioTxFee = big(uAmount.minus(FIXED_GAS))
      .div(big(1).add(bank.tax.taxRate))
      .mul(bank.tax.taxRate);
    const maxTax = big(bank.tax.maxTaxUUSD);

    console.log('useDepositTxFee.ts..()', ratioTxFee.toString());

    return max(min(ratioTxFee, maxTax), 0).plus(FIXED_GAS) as uUST<Big>;

    //if (ratioTxFee.gt(maxTax)) {
    //  return maxTax.add(FIXED_GAS) as uUST<Big>;
    //} else {
    //  return ratioTxFee.add(FIXED_GAS) as uUST<Big>;
    //}
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, depositAmount]);
}
