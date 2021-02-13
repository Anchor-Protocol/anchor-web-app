import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidWithdrawAmount(
  withdrawAmount: UST,
  bank: Bank,
  totalDeposit: uUST<BigSource>,
  txFee: uUST<Big> | undefined,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || withdrawAmount.length === 0) {
      return undefined;
    } else if (microfy(withdrawAmount).gt(totalDeposit)) {
      return `Not enough aUST`;
    } else if (txFee && big(bank.userBalances.uUSD).lt(txFee)) {
      return `Not enough UST`;
    }
    return undefined;
  }, [
    bank.status,
    bank.userBalances.uUSD,
    withdrawAmount,
    totalDeposit,
    txFee,
  ]);
}
