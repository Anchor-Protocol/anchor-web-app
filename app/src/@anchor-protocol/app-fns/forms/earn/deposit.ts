import { Rate, u, UST } from '@anchor-protocol/types';
import { computeMaxUstBalanceForUstTransfer } from '@libs/app-fns';
import { max, min } from '@libs/big-math';
import { microfy } from '@libs/formatter';
import { FormReturn } from '@libs/use-form';
import big, { Big } from 'big.js';

export interface EarnDepositFormInput {
  depositAmount: UST;
}

export interface EarnDepositFormDependency {
  userUUSTBalance: u<UST>;
  fixedGas: u<UST>;
  taxRate: Rate;
  maxTaxUUSD: u<UST>;
  isConnected: boolean;
}

export interface EarnDepositFormStates extends EarnDepositFormInput {
  availablePost: boolean;
  maxAmount: u<UST>;
  sendAmount?: u<UST>;
  txFee?: u<UST>;
  invalidTxFee?: string;
  invalidDepositAmount?: string;
  invalidNextTxFee?: string;
}

export interface EarnDepositFormAsyncStates {}

export const earnDepositForm =
  ({
    fixedGas,
    taxRate,
    maxTaxUUSD,
    userUUSTBalance,
    isConnected,
  }: EarnDepositFormDependency) =>
  ({
    depositAmount,
  }: EarnDepositFormInput): FormReturn<
    EarnDepositFormStates,
    EarnDepositFormAsyncStates
  > => {
    const depositAmountExists = depositAmount.length > 0;

    // txFee
    const txFee = (() => {
      if (!isConnected || !depositAmountExists) {
        return undefined;
      }

      const uAmount = microfy(depositAmount);
      const ratioTxFee = big(uAmount.minus(fixedGas))
        .div(big(1).add(taxRate))
        .mul(taxRate);
      const maxTax = big(maxTaxUUSD);
      return max(min(ratioTxFee, maxTax), 0).plus(fixedGas) as u<UST<Big>>;
    })();

    // sendAmount
    const sendAmount = txFee
      ? (microfy(depositAmount).plus(txFee) as u<UST<Big>>)
      : undefined;

    // maxAmount
    const maxAmount = computeMaxUstBalanceForUstTransfer(
      userUUSTBalance,
      taxRate,
      maxTaxUUSD,
      fixedGas,
    );

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

      return remainUUSD.lt(big(fixedGas).mul(2))
        ? `Leaving less UST in your account may lead to insufficient transaction fees for future transactions.`
        : undefined;
    })();

    return [
      {
        depositAmount,
        txFee: txFee?.toFixed() as u<UST>,
        sendAmount: sendAmount?.toFixed() as u<UST>,
        maxAmount: maxAmount?.toFixed() as u<UST>,
        invalidTxFee,
        invalidDepositAmount,
        invalidNextTxFee,
        availablePost:
          isConnected &&
          depositAmountExists &&
          big(depositAmount).gt(0) &&
          !invalidTxFee &&
          !invalidDepositAmount,
      },
      undefined,
    ];
  };
