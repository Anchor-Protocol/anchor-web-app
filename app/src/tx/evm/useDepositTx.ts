import { useMockTx } from './useMockTx';
import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn } from '@rx-stream/react';

export interface DepositTxProps {
  depositAmount: string;
}

export function useDepositTx():
  | StreamReturn<DepositTxProps, TxResultRendering>
  | [null, null] {
  return useMockTx<DepositTxProps>(10);
}
