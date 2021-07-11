import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import {
  TxReceipt,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { BigSource } from 'big.js';

export class TxHelper {
  private _savedTx: CreateTxOptions | null = null;
  private _savedTxResult: TxResult | null = null;

  constructor(private $: { txFee: uUST; network: NetworkInfo }) {}

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

  txHashReceipt = (): TxReceipt | null => {
    if (!this._savedTxResult) {
      return null;
    }

    const chainID = this.$.network.chainID;
    const txhash = this._savedTxResult.result.txhash;
    const html = `<a href="https://finder.terra.money/${chainID}/tx/${txhash}" target="_blank" rel="noreferrer">${truncate(
      txhash,
    )}</a>`;

    return {
      name: 'Tx Hash',
      value: {
        html,
      },
    };
  };

  txFeeReceipt = (txFee?: uUST<BigSource>): TxReceipt => {
    return {
      name: 'Tx Fee',
      value:
        formatUSTWithPostfixUnits(demicrofy(txFee ?? this.$.txFee)) + ' UST',
    };
  };

  failedToCreateReceipt = (error: Error): TxResultRendering => {
    return {
      value: null,

      phase: TxStreamPhase.SUCCEED,
      receiptErrors: [{ error }],
      receipts: [this.txHashReceipt(), this.txFeeReceipt()],
    } as TxResultRendering;
  };

  failedToFindRawLog = (): TxResultRendering => {
    return this.failedToCreateReceipt(new Error('Undefined RawLog'));
  };

  failedToFindEvents = (...events: string[]): TxResultRendering => {
    return this.failedToCreateReceipt(
      new Error(`Undefined events "${events.join(', ')}"`),
    );
  };

  failedToParseTxResult = (): TxResultRendering => {
    return this.failedToCreateReceipt(new Error('Failed to parse TxResult'));
  };
}

function truncate(
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}
