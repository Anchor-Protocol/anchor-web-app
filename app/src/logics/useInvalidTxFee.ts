import big from 'big.js';
import { BankState } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { ReactNode, useMemo } from 'react';

export function useInvalidTxFee(bank: BankState): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(FIXED_GAS)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);
}
