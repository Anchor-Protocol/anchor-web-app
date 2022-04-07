import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { useTransactions } from './storage';
import { TxEvent, useTx } from './useTx';
import { errorContains, formatError, TxError } from './utils';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface RestoreTxParams {
  txHash: string;
}

export const useRestoreTx = () => {
  const { provider, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const { removeTransaction } = useTransactions();

  const restoreTx = useCallback(
    async (
      txParams: RestoreTxParams,
      renderTxResults: Subject<TxRender>,
      txEvents: Subject<TxEvent<RestoreTxParams>>,
    ) => {
      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.restoreTx();
      writer.timer.start();

      try {
        const result = await xAnchor.restoreTx(
          txParams.txHash,
          (event) => {
            writer.restoreTx(event);
            txEvents.next({ event, txParams });
          },
          { manualRedemption: true },
        );

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

  const restoreTxStream = useTx(restoreTx, parseTx, null);

  return provider && connectionType ? restoreTxStream : [null, null];
};

const parseTx = (resp: NonNullable<TxResult>) => resp.tx;
