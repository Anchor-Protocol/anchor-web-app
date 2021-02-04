import { max, min } from '@anchor-protocol/big-math';
import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { useMemo } from 'react';

export function useDepositTxFee(
  depositAmount: UST,
  bank: Bank,
  fixedGas: uUST<BigSource>,
): uUST<Big> | undefined {
  return useMemo(() => {
    if (depositAmount.length === 0) return undefined;

    // MIN( MAX((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate, 0 ) , Max_tax) + Fixed_Gas

    const uAmount = microfy(depositAmount);
    const ratioTxFee = big(uAmount.minus(fixedGas))
      .div(big(1).add(bank.tax.taxRate))
      .mul(bank.tax.taxRate);
    const maxTax = big(bank.tax.maxTaxUUSD);

    return max(min(ratioTxFee, maxTax), 0).plus(fixedGas) as uUST<Big>;

    //if (ratioTxFee.gt(maxTax)) {
    //  return maxTax.add(FIXED_GAS) as uUST<Big>;
    //} else {
    //  return ratioTxFee.add(FIXED_GAS) as uUST<Big>;
    //}
  }, [bank.tax.maxTaxUUSD, bank.tax.taxRate, depositAmount, fixedGas]);
}
