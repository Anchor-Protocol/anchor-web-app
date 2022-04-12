import { Transaction } from '../storage';

export class TxState {
  public minimized: boolean;
  public storedTx?: Transaction;

  constructor({
    minimized,
    storedTx,
  }: {
    minimized: boolean;
    storedTx?: Transaction;
  }) {
    this.minimized = minimized;
    this.storedTx = storedTx;
  }
}
