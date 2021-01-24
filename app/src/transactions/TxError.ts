import { TxResult } from 'transactions/tx';

/**
 * @deprecated
 */
export class TxError extends Error {
  constructor(readonly msgs: TxResult['msgs']) {
    super(JSON.stringify(msgs, null, 2));
  }

  toString() {
    return ['TxError', JSON.stringify(this.msgs, null, 2)].join('\n');
  }
}
