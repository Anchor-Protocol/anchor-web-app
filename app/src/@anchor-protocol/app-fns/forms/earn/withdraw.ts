import { u, UST } from '@anchor-protocol/types';
import { microfy } from '@libs/formatter';
import { FormReturn } from '@libs/use-form';
import big, { Big, BigSource } from 'big.js';

export interface EarnWithdrawFormInput {
  withdrawAmount: UST;
}

export interface EarnWithdrawFormDependency {
  userUUSTBalance: u<UST<BigSource>>;
  fixedGas: u<UST<BigSource>>;
  totalDeposit: u<UST<BigSource>>;
  isConnected: boolean;
}

export interface EarnWithdrawFormStates extends EarnWithdrawFormInput {
  receiveAmount?: u<UST<BigSource>>;
  txFee?: u<UST<BigSource>>;
  invalidTxFee?: string;
  invalidWithdrawAmount?: string;
  availablePost: boolean;
}

export interface EarnWithdrawFormAsyncStates {}

export const earnWithdrawForm =
  ({
    isConnected,
    totalDeposit,
    userUUSTBalance,
    fixedGas,
  }: EarnWithdrawFormDependency) =>
  ({
    withdrawAmount,
  }: EarnWithdrawFormInput): FormReturn<
    EarnWithdrawFormStates,
    EarnWithdrawFormAsyncStates
  > => {
    if (withdrawAmount.length === 0) {
      return [
        {
          withdrawAmount: '' as UST,
          availablePost: false,
        },
        undefined,
      ];
    } else {
      // txFee
      const txFee = big(fixedGas) as u<UST<Big>>;

      // receiveAmount
      const receiveAmount = microfy(withdrawAmount).minus(txFee) as u<UST<Big>>;

      // invalidTxFee
      const invalidTxFee = (() => {
        return isConnected && big(userUUSTBalance).lt(txFee)
          ? 'Not enough transaction fees'
          : undefined;
      })();

      // invalidWithdrawAmount
      const invalidWithdrawAmount = (() => {
        if (!isConnected) {
          return undefined;
        }

        return microfy(withdrawAmount).gt(totalDeposit)
          ? `Not enough aUST`
          : big(userUUSTBalance).lt(txFee)
          ? `Not enough UST`
          : undefined;
      })();

      return [
        {
          withdrawAmount: withdrawAmount,
          txFee,
          receiveAmount,
          invalidTxFee,
          invalidWithdrawAmount,
          availablePost:
            isConnected &&
            big(withdrawAmount).gt(0) &&
            !invalidTxFee &&
            !invalidWithdrawAmount,
        },
        undefined,
      ];
    }
  };
