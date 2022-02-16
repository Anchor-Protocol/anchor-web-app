import { useMockTx } from './useMockTx';
import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn } from '@rx-stream/react';

export interface WithdrawTxProps {
  withdrawAmount: string;
}

export function useWithdrawTx():
  | StreamReturn<WithdrawTxProps, TxResultRendering>
  | [null, null] {
  return useMockTx(5);
}
