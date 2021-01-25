import { bLuna, microfy } from '@anchor-protocol/notation';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidDepositAmount(
  depositAmount: bLuna,
  bank: Bank,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || depositAmount.length === 0) {
      return undefined;
    } else if (microfy(depositAmount).gt(bank.userBalances.ubLuna ?? 0)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [depositAmount, bank.status, bank.userBalances.ubLuna]);
}
