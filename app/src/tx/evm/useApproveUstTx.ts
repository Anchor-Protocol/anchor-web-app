import { useMockTx } from './useMockTx';
import { TxResultRendering } from '@libs/app-fns';
import { StreamReturn } from '@rx-stream/react';

export function useApproveUstTx():
  | StreamReturn<void, TxResultRendering>
  | [null, null] {
  return useMockTx(2);
}
