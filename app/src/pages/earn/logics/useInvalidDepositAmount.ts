import { microfy, UST, uUST } from '@anchor-protocol/notation';
import { Big } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidDepositAmount(
  depositAmount: UST,
  bank: Bank,
  txFee: uUST<Big> | undefined,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || depositAmount.length === 0) {
      return undefined;
    } else if (
      microfy(depositAmount)
        .plus(txFee ?? 0)
        .gt(bank.userBalances.uUSD)
    ) {
      return `Not enough UST`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD, depositAmount, txFee]);
}
