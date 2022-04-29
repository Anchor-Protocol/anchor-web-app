import { formatUToken } from '@libs/formatter';
import { u, UST } from '@libs/types';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { CreateTxOptions } from '@terra-money/terra.js';
import { BigSource } from 'big.js';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '../../models/tx';
import { getTransactionDetailUrl } from 'utils/terrascope';

export class TxHelper {
  private _savedTx?: CreateTxOptions;
  private _savedTxResult?: TxResult;
  private _txHash?: string;

  constructor(private $: { txFee: u<UST>; network: NetworkInfo }) {}

  get savedTx(): CreateTxOptions {
    if (!this._savedTx) {
      throw new Error('Saved Tx not found');
    }
    return this._savedTx;
  }

  setTxHash = (txHash: string) => {
    this._txHash = txHash;
  };

  saveTx = (tx: CreateTxOptions) => {
    this._savedTx = tx;
  };

  saveTxResult = (txResult: TxResult) => {
    this._savedTxResult = txResult;
  };

  txHash = () => {
    return this._savedTxResult?.result.txhash ?? this._txHash;
  };

  txHashReceipt = (): TxReceipt | null => {
    if (!this.txHash()) {
      return null;
    }

    const chainID = this.$.network.chainID;
    const txhash = this.txHash();
    const html = `<a href="https://finder.terra.money/${chainID}/tx/${txhash}" target="_blank" rel="noreferrer">${truncate(
      txhash,
    )}" target="_blank" rel="noreferrer">${truncate(txhash)}</a>`;

    return {
      name: 'Tx Hash',
      value: {
        html,
      },
    };
  };

  txFeeReceipt = (txFee?: u<UST<BigSource>>): TxReceipt => {
    return {
      name: 'Tx Fee',
      value: formatUToken(txFee ?? this.$.txFee) + ' UST',
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
