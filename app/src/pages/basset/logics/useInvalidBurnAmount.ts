import { bLuna, microfy } from '@anchor-protocol/notation';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidBurnAmount(burnAmount: bLuna, bank: Bank): ReactNode {
  return useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || burnAmount.length === 0) {
      return undefined;
    } else if (microfy(burnAmount).gt(bank.userBalances.ubLuna ?? 0)) {
      return `Not enough bAssets`;
    }
    return undefined;
  }, [bank.status, bank.userBalances.ubLuna, burnAmount]);
}
