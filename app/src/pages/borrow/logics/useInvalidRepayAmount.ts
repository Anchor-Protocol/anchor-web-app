import { microfy, UST } from '@anchor-protocol/notation';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidRepayAmount(repayAmount: UST, bank: Bank): ReactNode {
  return useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || repayAmount.length === 0) {
      return undefined;
    } else if (microfy(repayAmount).gt(bank.userBalances.uUSD)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [repayAmount, bank.status, bank.userBalances.uUSD]);
}
