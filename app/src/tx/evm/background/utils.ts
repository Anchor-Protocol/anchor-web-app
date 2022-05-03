import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { RefCallback } from 'hooks';
import { Observable } from 'rxjs';
import { Transaction, TransactionDisplay } from '../storage';
import { TxKind } from '../utils';
import { CreateTxResult } from '../createTx';
import { v4 as uuid } from 'uuid';

export const BACKGROUND_TRANSCATION_TAB_ID = uuid();

export type TxAction = {
  events: Observable<CrossChainEvent<ContractReceipt>>;
  display: TransactionDisplay;
  kind: TxKind;
  request: Promise<ContractReceipt>;
};

export type TxStorage = {
  save: RefCallback<(tx: Transaction) => void>;
  delete: RefCallback<(txHash: string) => void>;
  update: RefCallback<(txHash: string, updates: Partial<Transaction>) => void>;
};

export type TxHandlers = {
  createRestoreTx: RefCallback<() => CreateTxResult<string, ContractReceipt>>;
  refetch: RefCallback<(kind: TxKind) => void>;
  pushNotification: RefCallback<(tx: Transaction) => void>;
};
