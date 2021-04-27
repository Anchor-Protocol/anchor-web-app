import { TxResult } from './types';

export class UserDenied extends Error {
  constructor() {
    super('User Dinied');
    this.name = 'UserDenied';
  }

  toString = () => {
    return `[${this.name}]`;
  };
}

/**
 * Failed to create tx (did not make a txhash)
 */
export class CreateTxFailed extends Error {
  constructor(public readonly txResult: TxResult) {
    super(JSON.stringify(txResult, null, 2));
    this.name = 'CreateTxFailed';
  }

  toString = () => {
    return `[${this.name}]\n${this.message}`;
  };
}

/**
 * Failed process the tx (maked a txhash)
 */
export class TxFailed extends Error {
  constructor(public readonly txhash: string, message: string) {
    super(message);
    this.name = 'TxFailed';
  }

  toString = () => {
    return `[${this.name} txhash="${this.txhash}"]\n${this.message}`;
  };
}
