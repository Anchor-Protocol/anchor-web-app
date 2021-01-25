import big from 'big.js';
import { Bank } from 'contexts/bank';
import { FIXED_GAS } from 'env';
import { ReactNode, useMemo } from 'react';

export function useInvalidTxFee(bank: Bank): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(FIXED_GAS)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);
}
