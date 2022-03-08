import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { Transaction } from './storage/useTransactions';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { TxEventHandler } from './useTx';

export type BackgroundTxResult = CrossChainTxResponse<ContractReceipt> | null;
export type BackgroundTxRender = TxResultRendering<BackgroundTxResult>;

export interface BackgroundTxParams {}

export const useBackgroundTx = (
  tx: Transaction,
): PersistedTxResult<BackgroundTxParams, BackgroundTxResult> | undefined => {
  const xAnchor = useEvmCrossAnchorSdk();

  const backgroundTx = useCallback(
    async (
      _txParams: BackgroundTxParams,
      _renderTxResults: Subject<BackgroundTxRender>,
      handleEvent: TxEventHandler<BackgroundTxParams>,
    ) => {
      try {
        const result = await xAnchor.restoreTx(tx.receipt, (event) => {
          handleEvent(event, {});
        });
        return result;
      } catch (error: any) {
        // TODO: capture sequence already processed
        console.log(error);
        throw error;
      }
    },
    [xAnchor, tx],
  );

  const persistedTxResult = usePersistedTx<
    BackgroundTxParams,
    BackgroundTxResult
  >(
    backgroundTx,
    (resp) => resp.tx,
    null,
    () => tx.display,
  );

  return persistedTxResult;
};
