import { uLuna } from '@anchor-protocol/notation';
import big, { Big } from 'big.js';
import { useMemo } from 'react';

export function useWithdrawableAmount(
  withdrawable: uLuna | undefined,
): uLuna<Big> {
  return useMemo<uLuna<Big>>(() => {
    return big(withdrawable ?? 0) as uLuna<Big>;
  }, [withdrawable]);
}
