import { TxResultRendering } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback, useRef } from 'react';
import { Subject } from 'rxjs';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { useTransactions } from './storage';
import { RenderedTxResult, useRenderedTx } from './useRenderedTx';
import { errorContains, formatError, TxError } from './utils';

export interface RestoreTxParams {
  txHash: string;
}

export const useRestoreTx = ():
  | RenderedTxResult<RestoreTxParams>
  | undefined => {
  const { provider, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const { removeTransaction } = useTransactions();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const restoreTx = useCallback(
    async (txParams: RestoreTxParams) => {
      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.restoreTx();
      writer.timer.start();

      try {
        const result = await xAnchor.restoreTx(txParams.txHash, {
          manualRedemption: true,
          handleEvent: (event) => {
            writer.restoreTx(event);
          },
        });

        removeTransaction(txParams.txHash);
        return result;
      } catch (error: any) {
        if (errorContains(error, TxError.TxAlreadyProcessed)) {
          removeTransaction(txParams.txHash);
          return null;
        }

        if (errorContains(error, TxError.TxFailed)) {
          throw new Error(formatError(error, TxError.TxFailed));
        }

        console.log(error);
        throw error;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, connectionType, removeTransaction],
  );

  const restoreTxResult = useRenderedTx(restoreTx);

  renderTxResultsRef.current = restoreTxResult?.renderTxResults;

  return provider && connectionType ? restoreTxResult : undefined;
};
