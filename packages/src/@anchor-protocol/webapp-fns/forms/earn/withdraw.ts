import { microfy } from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export interface EarnWithdrawFormInput {
  withdrawAmount: UST;
}

export interface EarnWithdrawFormDependency {
  userUUSTBalance: uUST<BigSource>;
  fixedGas: uUST<BigSource>;
  totalDeposit: uUST<BigSource>;
  isConnected: boolean;
}

export interface EarnWithdrawFormStates extends EarnWithdrawFormInput {
  receiveAmount?: uUST<BigSource>;
  txFee?: uUST<BigSource>;
  invalidTxFee?: string;
  invalidWithdrawAmount?: string;
  availablePost: boolean;
}

export function earnWithdrawForm(
  { withdrawAmount }: EarnWithdrawFormInput,
  {
    fixedGas,
    totalDeposit,
    userUUSTBalance,
    isConnected,
  }: EarnWithdrawFormDependency,
): EarnWithdrawFormStates {
  if (withdrawAmount.length === 0 || withdrawAmount.trim() === '0') {
    return {
      withdrawAmount: '' as UST,
      availablePost: false,
    };
  } else {
    // txFee
    const txFee = big(fixedGas) as uUST<Big>;

    // receiveAmount
    const receiveAmount = microfy(withdrawAmount).minus(txFee) as uUST<Big>;

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

    return {
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
    };
  }
}
