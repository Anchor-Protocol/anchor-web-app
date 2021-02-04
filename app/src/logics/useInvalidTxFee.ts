import { uUST } from '@anchor-protocol/notation';
import big, { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidTxFee(
  bank: Bank,
  fixedGas: uUST<BigSource>,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGas)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD, fixedGas]);
}
