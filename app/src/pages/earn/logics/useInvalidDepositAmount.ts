import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big } from 'big.js';
import { BankState } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidDepositAmount(
  depositAmount: UST,
  bank: BankState,
  txFee: uUST<Big> | undefined,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || depositAmount.length === 0) {
      return undefined;
    } else if (
      microfy(depositAmount)
        .plus(txFee ?? 0)
        .gt(bank.userBalances.uUSD ?? 0)
    ) {
      return `Not enough UST`;
    }
    return undefined;
  }, [depositAmount, bank.status, bank.userBalances.uUSD, txFee]);
}
