import { useMockTx } from './useMockTx';
import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn } from '@rx-stream/react';

export interface DepositUstTxProps {
  depositAmount: string;
}

export function useDepositUstTx():
  | StreamReturn<DepositUstTxProps, TxResultRendering>
  | [null, null] {
  return useMockTx<DepositUstTxProps>(10);
}
