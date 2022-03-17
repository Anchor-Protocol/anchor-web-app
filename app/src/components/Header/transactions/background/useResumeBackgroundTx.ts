import { Transaction, useResumeTx } from 'tx/evm';
import { useExecuteReservedTx } from './useExecuteReservedTx';
import { useReserveBackgroundTx } from './useReserveBackgroundTx';

export const useResumeBackgroundTx = (tx: Transaction) => {
  const backgroundTx = useResumeTx(tx);

  useReserveBackgroundTx(tx);
  useExecuteReservedTx(tx, backgroundTx);

  return backgroundTx;
};
