import { TxInfo } from '@terra-money/terra.js';
import { useCallback } from 'react';
import { TerraTxProgressWriter } from './TerraTxProgressWriter';

export const useTxTimer = <TxParams>(
  sendTx: (params: TxParams, writer: TerraTxProgressWriter) => Promise<TxInfo>,
  statusMessage: string,
) => {
  return useCallback(
    async (txParams: TxParams, writer: TerraTxProgressWriter) => {
      try {
        writer.writeStatus(statusMessage);
        writer.timer.start();
        const result = await sendTx(txParams, writer);
        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [sendTx, statusMessage],
  );
};
