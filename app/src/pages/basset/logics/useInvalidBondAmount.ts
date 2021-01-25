import { Luna, microfy } from '@anchor-protocol/notation';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidBondAmount(bondAmount: Luna, bank: Bank): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || bondAmount.length === 0) {
      return undefined;
    } else if (microfy(bondAmount).gt(bank.userBalances.uLuna ?? 0)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.uLuna, bondAmount]);
}
