import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEvent } from './useTx';
import { TransactionDisplay } from './storage/useTransactions';
import { PersistedTxResult, PersistedTxUtils } from './usePersistedTx';
import { useMemo } from 'react';
import { useBackgroundTxRequest } from './background';
import { v4 as uuid } from 'uuid';
import { useEffectOnce } from 'usehooks-ts';

type TxRender<TxResult> = TxResultRendering<TxResult>;

type BackgroundTxUtils = PersistedTxUtils & {
  alreadyRunning: boolean;
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
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  displayTx: (txParams: TxParams) => TransactionDisplay,
  txHash?: string,
): BackgroundTxResult<TxParams, TxResult> | undefined => {
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

  if (!request) {
    return undefined;
  }

  return {
    ...request.persistedTxResult,
    utils: {
      ...request.persistedTxResult?.utils,
      alreadyRunning: Boolean(request),
    },
  } as BackgroundTxResult<TxParams, TxResult>;
};
