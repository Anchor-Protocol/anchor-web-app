import {
  TxReceipt,
  TxReceiptLike,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { formatUToken } from '@libs/formatter';
import { u, UST } from '@libs/types';
import { NetworkInfo } from '@terra-money/use-wallet';
import { BigSource } from 'big.js';
import { Subject } from 'rxjs';
import { getTransactionDetailUrl } from 'utils/terrascope';
import { TxProgressWriter } from '../base';

export class TerraTxProgressWriter extends TxProgressWriter<TxResultRendering> {
  private readonly _description: string;
  private txHash?: string;
  private txFee: string;
  private network: NetworkInfo;

  constructor(
    subject: Subject<TxResultRendering>,
    network: NetworkInfo,
    txFee: string,
  ) {
    super(subject);
    this.network = network;
    this.txFee = txFee;
    this._description = `Transaction sent, please check your wallet for further instructions.`;
  }

  private merge(
    source: TxReceiptLike[],
    name: string,
    value: string,
  ): TxReceiptLike[] {
    const receipts = [...source];

    const index = receipts.findIndex(
      (receipt) => receipt && 'name' in receipt && receipt.name === name,
    );

    receipts[index < 0 ? receipts.length : index] = {
      name,
      value,
    };

    return receipts;
  }

  public writeStatus(message: string) {
    this.write((current) => {
      return {
        ...current,
        message,
        description: this._description,
        receipts: this.merge(current.receipts, 'Status', 'Executing'),
      };
    });
  }

  public writeTxHash(txHash: string) {
    this.txHash = txHash;
    this.write((current) => {
      return {
        ...current,
        description: this._description,
        receipts: this.merge(current.receipts, 'Tx Hash', truncate(txHash)),
      };
    });
  }

  public txHashReceipt = (): TxReceipt | null => {
    if (!this.txHash) {
      return null;
    }

    const chainID = this.network.chainID;
    const html = `<a href="${getTransactionDetailUrl(
      chainID,
      this.txHash,
    )}" target="_blank" rel="noreferrer">${truncate(this.txHash)}</a>`;

    return {
      name: 'Tx Hash',
      value: {
        html,
      },
    };
  };

  public txFeeReceipt = (txFee?: u<UST<BigSource>>): TxReceipt => {
    return {
      name: 'Tx Fee',
      value: formatUToken(txFee ?? (this.txFee as u<UST>)) + ' UST',
    };
  };

  public failedToCreateReceipt = (error: Error): TxResultRendering => {
    return {
      value: null,

      phase: TxStreamPhase.SUCCEED,
      receiptErrors: [{ error }],
      receipts: [this.txHashReceipt(), this.txFeeReceipt()],
    } as TxResultRendering;
  };

  public failedToFindRawLog = (): TxResultRendering => {
    return this.failedToCreateReceipt(new Error('Undefined RawLog'));
  };

  public failedToFindEvents = (...events: string[]): TxResultRendering => {
    return this.failedToCreateReceipt(
      new Error(`Undefined events "${events.join(', ')}"`),
    );
  };

  public failedToParseTxResult = (): TxResultRendering => {
    return this.failedToCreateReceipt(new Error('Failed to parse TxResult'));
  };
}

export const truncate = (
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string => {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
};
