import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useRefetchQueries } from '@libs/app-provider';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { Transaction, useTransactions } from './storage/useTransactions';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { TxEvent } from './useTx';
import {
  errorContains,
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxError,
} from './utils';

export type ResumeTxResult = CrossChainTxResponse<ContractReceipt> | null;
export type ResumeTxRender = TxResultRendering<ResumeTxResult>;

export interface ResumeTxParams {}

export const useResumeTx = (
  tx: Transaction,
): BackgroundTxResult<ResumeTxParams, ResumeTxResult> | undefined => {
  const xAnchor = useEvmCrossAnchorSdk();
  const { removeTransaction } = useTransactions();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const backgroundTx = useCallback(
    async (
      txParams: ResumeTxParams,
      _renderTxResults: Subject<ResumeTxRender>,
      txEvents: Subject<TxEvent<ResumeTxParams>>,
    ) => {
      try {
        const result = await xAnchor.restoreTx(tx.txHash, (event) => {
          txEvents.next({ event, txParams });
        });
        refetchQueries(refetchQueryByTxKind(tx.display.txKind));
        return result;
      } catch (error: any) {
        if (errorContains(error, TxError.TxAlreadyProcessed)) {
          refetchQueries(refetchQueryByTxKind(tx.display.txKind));
          removeTransaction(tx.txHash);
          return null;
        }
        console.log(error);
        throw error;
      }
    },
    [xAnchor, tx.txHash, refetchQueries, tx.display.txKind, removeTransaction],
  );

  const displayTx = useCallback(() => tx.display, [tx.display]);

  const persistedTxResult = useBackgroundTx<ResumeTxParams, ResumeTxResult>(
    backgroundTx,
    (resp) => resp.tx,
    null,
    displayTx,
    tx,
  );

  return persistedTxResult;
};
