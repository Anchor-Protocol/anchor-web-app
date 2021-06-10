import { microfy } from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import { max, min } from '@terra-dev/big-math';
import big, { Big, BigSource } from 'big.js';

export interface EarnDepositFormInput {
  depositAmount: UST;
}

export interface EarnDepositFormDependency {
  userUUSTBalance: uUST<BigSource>;
  txFixedGas: uUST<BigSource>;
  fixedGas: uUST<BigSource>;
  taxRate: Rate<BigSource>;
  maxTaxUUSD: uUST<BigSource>;
  isConnected: boolean;
}

export interface EarnDepositFormStates extends EarnDepositFormInput {
  availablePost: boolean;
  maxAmount: uUST<BigSource>;
  sendAmount?: uUST<BigSource>;
  txFee?: uUST<BigSource>;
  invalidTxFee?: string;
  invalidDepositAmount?: string;
  invalidNextTxFee?: string;
}

export function earnDepositForm(
  { depositAmount }: EarnDepositFormInput,
  {
    txFixedGas,
    fixedGas,
    taxRate,
    maxTaxUUSD,
    userUUSTBalance,
    isConnected,
  }: EarnDepositFormDependency,
): EarnDepositFormStates {
  const depositAmountExists = depositAmount.length > 0 && depositAmount !== '0';

  // txFee
  const txFee = (() => {
    if (!isConnected || !depositAmountExists) {
      return undefined;
    }

    const uAmount = microfy(depositAmount);
    const ratioTxFee = big(uAmount.minus(txFixedGas))
      .div(big(1).add(taxRate))
      .mul(taxRate);
    const maxTax = big(maxTaxUUSD);
    return max(min(ratioTxFee, maxTax), 0)
      .plus(txFixedGas)
      .mul(1.1) as uUST<Big>;
  })();

  // sendAmount
  const sendAmount = txFee
    ? (microfy(depositAmount).plus(txFee) as uUST<Big>)
    : undefined;

  // maxAmount
  const maxAmount = (() => {
    if (!isConnected || big(userUUSTBalance).lte(0)) {
      return big(0) as uUST<Big>;
    }

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas
    // without_fixed_gas = (uusd balance - fixed_gas)
    // tax_fee = without_fixed_gas * tax_rate
    // without_tax_fee = if (tax_fee < max_tax) without_fixed_gas - tax_fee
    //                   else without_fixed_gas - max_tax

    const userUUSD = big(userUUSTBalance);
    const withoutFixedGas = userUUSD.minus(txFixedGas);
    const txFee = withoutFixedGas.mul(taxRate);
    const result = withoutFixedGas.minus(min(txFee, maxTaxUUSD));

    return result.minus(txFixedGas).lte(0)
      ? (big(0) as uUST<Big>)
      : (result.minus(txFixedGas) as uUST<Big>);
  })();

  // invalidTxFee
  const invalidTxFee = (() => {
    return isConnected && txFee && big(userUUSTBalance).lt(txFee)
      ? 'Not enough transaction fees'
      : undefined;
  })();

  // invalidDepositAmount
  const invalidDepositAmount = (() => {
    if (!isConnected || !depositAmountExists || !txFee) {
      return undefined;
    }

    return microfy(depositAmount).plus(txFee).gt(userUUSTBalance)
      ? `Not enough UST`
      : undefined;
  })();

  // invalidNextTxFee
  const invalidNextTxFee = (() => {
    if (
      !isConnected ||
      !!invalidDepositAmount ||
      !maxAmount ||
      !depositAmountExists
    ) {
      return undefined;
    }

    const remainUUSD = big(userUUSTBalance)
      .minus(microfy(depositAmount))
      .minus(txFee ?? 0);

    return remainUUSD.lt(fixedGas)
      ? `You may run out of USD balance needed for future transactions.`
      : undefined;
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
      depositAmountExists &&
      big(depositAmount).gt(0) &&
      !invalidTxFee &&
      !invalidDepositAmount,
  };
}
