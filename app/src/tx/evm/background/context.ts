import { TxResultRendering } from '@libs/app-fns';
import { ContractReceipt } from 'ethers';
import { createContext } from 'react';
import { Subject } from 'rxjs';
import { TransactionDisplay } from '../storage';
import { PersistedTxResult } from '../usePersistedTx';
import { TxEvent } from '../useTx';

type TxRender<TxResult> = TxResultRendering<TxResult>;

export type BackgroundTxRequest<TxParams = any, TxResult = any> = {
  persistedTxResult?: PersistedTxResult<TxParams, TxResult>;
  txHash?: string;
  id: string;
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender<TxResult>>,
    txEvents: Subject<TxEvent<TxParams>>,
  ) => Promise<NonNullable<TxResult>>;
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt;
  emptyTxResult: TxResult;
  displayTx: (txParams: TxParams) => TransactionDisplay;
};

type BackgroundTxRequestContextValue = {
  getRequest: (
    input: { id: string } | { txHash: string },
  ) => BackgroundTxRequest | undefined;
  register: (request: BackgroundTxRequest) => void;
};

export const BackgroundTxRequestContext =
  createContext<BackgroundTxRequestContextValue>({
    register: () => {},
    getRequest: () => undefined,
  });
