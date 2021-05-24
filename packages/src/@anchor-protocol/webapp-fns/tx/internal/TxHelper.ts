import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import { TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import {
  TxHashLink,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { createElement } from 'react';

export class TxHelper {
  private _savedTx: CreateTxOptions | null = null;
  private _savedTxResult: TxResult | null = null;

  constructor(private txFee: uUST) {}

  get savedTx(): CreateTxOptions {
    if (!this._savedTx) {
      throw new Error('Saved Tx not found');
    }
    return this._savedTx;
  }

  saveTx = (tx: CreateTxOptions) => {
    this._savedTx = tx;
  };

  saveTxResult = (txResult: TxResult) => {
    this._savedTxResult = txResult;
  };

  txHashReceipt = () => {
    return this._savedTxResult
      ? {
          name: 'Tx Hash',
          value: createElement(TxHashLink, {
            txHash: this._savedTxResult.result.txhash,
          }),
        }
      : null;
  };

  txFeeReceipt = () => {
    return {
      name: 'Tx Fee',
      value: formatUSTWithPostfixUnits(demicrofy(this.txFee)) + ' UST',
    };
  };

  failedToCreateReceipt = (error: Error) => {
    return {
      value: null,

      phase: TxStreamPhase.SUCCEED,
      receiptErrors: [{ error }],
      receipts: [this.txHashReceipt(), this.txFeeReceipt()],
    } as TxResultRendering;
  };

  failedToFindRawLog = () => {
    return this.failedToCreateReceipt(new Error('Undefined RawLog'));
  };

  failedToFindEvents = (...events: string[]) => {
    return this.failedToCreateReceipt(
      new Error(`Undefined events "${events.join(', ')}"`),
    );
  };

  failedToParseTxResult = () => {
    return this.failedToCreateReceipt(new Error('Failed to parse TxResult'));
  };
}
