import { microfy } from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import { max, min } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';

export interface EarnDepositFormInput {
  depositAmount: UST;
}

export interface EarnDepositFormDependency {
  userUUSTBalance: uUST<BigSource>;
  fixedGas: uUST<BigSource>;
  taxRate: Rate<BigSource>;
  maxTaxUUSD: uUST<BigSource>;
  isConnected: boolean;
}

export interface EarnDepositFormStates extends EarnDepositFormInput {
  sendAmount?: uUST<BigSource>;
  txFee?: uUST<BigSource>;
  maxAmount?: uUST<BigSource>;
  invalidTxFee?: string;
  invalidDepositAmount?: string;
  invalidNextTxFee?: string;
  availablePost: boolean;
}

export function earnDepositForm(
  { depositAmount }: EarnDepositFormInput,
  {
    fixedGas,
    taxRate,
    maxTaxUUSD,
    userUUSTBalance,
    isConnected,
  }: EarnDepositFormDependency,
): EarnDepositFormStates {
  if (depositAmount.length === 0 || depositAmount.trim() === '0') {
    return {
      depositAmount: '' as UST,
      availablePost: false,
    };
  } else {
    // txFee
    const txFee = (() => {
      const uAmount = microfy(depositAmount);
      const ratioTxFee = big(uAmount.minus(fixedGas))
        .div(big(1).add(taxRate))
        .mul(taxRate);
      const maxTax = big(maxTaxUUSD);
      return max(min(ratioTxFee, maxTax), 0).plus(fixedGas) as uUST<Big>;
    })();

    // sendAmount
    const sendAmount = microfy(depositAmount).plus(txFee) as uUST<Big>;

    // maxAmount
    const maxAmount = (() => {
      if (!isConnected || big(userUUSTBalance).lte(0)) {
        return undefined;
      }

      // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas
      // without_fixed_gas = (uusd balance - fixed_gas)
      // tax_fee = without_fixed_gas * tax_rate
      // without_tax_fee = if (tax_fee < max_tax) without_fixed_gas - tax_fee
      //                   else without_fixed_gas - max_tax

      const userUUSD = big(userUUSTBalance);
      const withoutFixedGas = userUUSD.minus(fixedGas);
      const txFee = withoutFixedGas.mul(taxRate);
      const result = withoutFixedGas.minus(min(txFee, maxTaxUUSD));

      return result.minus(fixedGas).lte(0)
        ? undefined
        : (result.minus(fixedGas) as uUST<Big>);
    })();

    // invalidTxFee
    const invalidTxFee = (() => {
      return isConnected && big(userUUSTBalance).lt(txFee)
        ? 'Not enough transaction fees'
        : undefined;
    })();

    // invalidDepositAmount
    const invalidDepositAmount = (() => {
      return isConnected &&
        !!txFee &&
        microfy(depositAmount).plus(txFee).gt(userUUSTBalance)
        ? `Not enough UST`
        : undefined;
    })();

    // invalidNextTxFee
    const invalidNextTxFee = (() => {
      if (!isConnected || !!invalidDepositAmount || !maxAmount) {
        return undefined;
      }

      const remainUUSD = big(userUUSTBalance)
        .minus(microfy(depositAmount))
        .minus(txFee ?? 0);

      if (remainUUSD.lt(fixedGas)) {
        return `You may run out of USD balance needed for future transactions.`;
      }

      return undefined;
    })();

    return {
      depositAmount,
      txFee,
      sendAmount,
      maxAmount,
      invalidTxFee,
      invalidDepositAmount,
      invalidNextTxFee,
      availablePost:
        isConnected &&
        big(depositAmount).gt(0) &&
        !invalidTxFee &&
        !invalidDepositAmount,
    };
  }
}
