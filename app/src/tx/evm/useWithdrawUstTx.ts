import { useMockTx } from './useMockTx';
import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn } from '@rx-stream/react';

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxResultRendering>
  | [null, null] {
  return useMockTx(5);
}
