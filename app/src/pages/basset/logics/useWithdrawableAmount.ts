import { uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { Data as Withdrawable } from '../queries/withdrawable';
import { useMemo } from 'react';

export function useWithdrawableAmount(
  withdrawable: Withdrawable | undefined,
): uLuna<Big> {
  return useMemo<uLuna<Big>>(() => {
    return big(
      withdrawable?.withdrawableAmount.withdrawable ?? 0,
    ) as uLuna<Big>;
  }, [withdrawable?.withdrawableAmount.withdrawable]);
}
