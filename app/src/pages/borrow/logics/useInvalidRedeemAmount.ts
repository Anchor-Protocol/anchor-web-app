import { bLuna, microfy, ubLuna } from '@anchor-protocol/notation';
import { BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidRedeemAmount(
  redeemAmount: bLuna,
  bank: Bank,
  withdrawableMaxAmount: ubLuna<BigSource>,
): ReactNode {
  return useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || redeemAmount.length === 0) {
      return undefined;
    } else if (microfy(redeemAmount).gt(withdrawableMaxAmount ?? 0)) {
      return `Cannot withdraw more than collateralized amount`;
    }
    return undefined;
  }, [redeemAmount, bank.status, withdrawableMaxAmount]);
}
