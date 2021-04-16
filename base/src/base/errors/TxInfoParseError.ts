import { TxResult } from '@anchor-protocol/wallet-provider';
import { Data } from '../queries/txInfos';

export class TxInfoParseError extends Error {
  constructor(
    public readonly txResult: TxResult,
    public readonly txInfo: Data,
    message?: string,
  ) {
    super(message);
    this.name = 'TxInfoParseError';
  }

  toString = () => {
    return `[${this.name}: ${this.message}]\n${JSON.stringify(
      {
        txResult: this.txResult,
        txInfo: this.txInfo,
      },
      null,
      2,
    )}`;
  };
}
