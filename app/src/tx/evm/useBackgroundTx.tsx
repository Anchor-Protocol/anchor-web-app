import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent } from './useTx';
import { TransactionDisplay } from './storage/useTransactions';
import { PersistedTxResult } from './usePersistedTx';
import { useMemo } from 'react';
import { useBackgroundTxRequest } from './background';
import { v4 as uuid } from 'uuid';
import { useEffectOnce } from 'usehooks-ts';

type TxRender<TxResult> = TxResultRendering<TxResult>;
export type BackgroundTxResult<TxParams, TxResult> = PersistedTxResult<
  TxParams,
  TxResult
>;

export const useBackgroundTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender<TxResult>>,
    txEvents: Subject<TxEvent<TxParams>>,
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
  txHash?: string,
): BackgroundTxResult<TxParams, TxResult> => {
  const backgroundTxId = useMemo(() => uuid(), []);
  const requestInput = Boolean(txHash)
    ? { txHash: txHash! }
    : { id: backgroundTxId };
  const { register, getRequest } = useBackgroundTxRequest();
  const request = getRequest(requestInput);

  useEffectOnce(() => {
    if (!request) {
      register({
        id: backgroundTxId,
        txHash,
        parseTx,
        displayTx,
        emptyTxResult,
        sendTx,
      });
    }
  });

  return request?.persistedTxResult as BackgroundTxResult<TxParams, TxResult>;
};
