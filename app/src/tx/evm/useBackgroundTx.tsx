import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent } from './useTx';
import { Transaction, TransactionDisplay } from './storage/useTransactions';
import { PersistedTxResult, PersistedTxUtils } from './usePersistedTx';
import { useMemo, useState } from 'react';
import { useBackgroundTxRequest } from './background';
import { v4 as uuid } from 'uuid';
import { useTimeout } from 'usehooks-ts';

type TxRender<TxResult> = TxResultRendering<TxResult>;

type BackgroundTxUtils = PersistedTxUtils & {
  alreadyRunning: boolean;
  dismissTx: (txHash?: string) => void;
};

export type BackgroundTxResult<TxParams, TxResult> = PersistedTxResult<
  TxParams,
  TxResult
> & {
  utils: BackgroundTxUtils;
};

export const useBackgroundTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender<TxResult>>,
    txEvents: Subject<TxEvent<TxParams>>,
  ) => Promise<TxResult>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
  tx?: Transaction,
): BackgroundTxResult<TxParams, TxResult> | undefined => {
  // assume it is running by default, clear the flag if registered
  const [alreadyRunning, setAlreadyRunning] = useState<boolean>(
    !tx || Boolean(tx.backgroundTransactionTabId),
  );
  const backgroundTxId = useMemo(() => uuid(), []);
  const registerAfter = useMemo(() => Math.random() * 500, []);
  const txHash = tx?.txHash;
  const requestInput = Boolean(txHash)
    ? { txHash: txHash! }
    : { id: backgroundTxId };
  const { register, getRequest } = useBackgroundTxRequest();
  const request = getRequest(requestInput);

  useTimeout(() => {
    if (!request) {
      register({
        id: backgroundTxId,
        txHash,
        parseTx,
        displayTx,
        emptyTxResult,
        sendTx,
      });
      setAlreadyRunning(false);
    }
  }, registerAfter);

  if (!request) {
    return undefined;
  }

  return {
    ...request.persistedTxResult,
    utils: {
      ...request.persistedTxResult?.utils,
      alreadyRunning,
    },
  } as BackgroundTxResult<TxParams, TxResult>;
};
