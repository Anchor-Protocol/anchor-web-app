import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { Transaction } from './storage/useTransactions';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { TxEvent } from './useTx';

export type ResumeTxResult = CrossChainTxResponse<ContractReceipt> | null;
export type ResumeTxRender = TxResultRendering<ResumeTxResult>;

export interface ResumeTxParams {}

export const useResumeTx = (
  tx: Transaction,
): BackgroundTxResult<ResumeTxParams, ResumeTxResult> | undefined => {
  const xAnchor = useEvmCrossAnchorSdk();
  const backgroundTx = useCallback(
    async (
      txParams: ResumeTxParams,
      _renderTxResults: Subject<ResumeTxRender>,
      txEvents: Subject<TxEvent<ResumeTxParams>>,
    ) => {
      try {
        const result = await xAnchor.restoreTx(tx.receipt, (event) => {
          txEvents.next({ event, txParams });
        });
        return result;
      } catch (error: any) {
        // TODO: capture sequence already processed
        console.log(error);
        throw error;
      }
    },
    [xAnchor, tx.receipt],
  );

  const displayTx = useCallback(() => tx.display, [tx.display]);

  const persistedTxResult = useBackgroundTx<ResumeTxParams, ResumeTxResult>(
    backgroundTx,
    (resp) => resp.tx,
    null,
    displayTx,
    tx.receipt.transactionHash,
  );

  return persistedTxResult;
};
