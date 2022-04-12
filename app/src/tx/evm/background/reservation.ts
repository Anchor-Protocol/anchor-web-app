import { Transaction } from '../storage';
import { TxManager } from './manager';

export class TxReservations {
  private reservations: { [txHash: string]: TxReservation } = {};

  constructor(manager: TxManager) {
    // unreserve all active actors in current tab on page reload
    window.addEventListener('beforeunload', () => {
      manager.actors.forEach((actor) => {
        if (actor.state.storedTx?.txHash) {
          manager.storage.update(actor.state.storedTx.txHash, {
            backgroundTransactionTabId: undefined,
          });
        }
      });
    });
  }

  public contains(tx: Transaction) {
    return Boolean(this.reservations[tx.txHash]);
  }

  public remove(tx: Transaction) {
    const { [tx.txHash]: omit, ...rest } = this.reservations;
    this.reservations = rest;
  }

  public add(tx: Transaction) {
    const reservation = new TxReservation();
    this.reservations = { ...this.reservations, [tx.txHash]: reservation };
  }

  public get(tx: Transaction) {
    return this.reservations[tx.txHash];
  }
}

export class TxReservation {
  private reserveAfter: number = Math.random() * 10000;
  public promise: Promise<boolean>;
  private resolve?: (val: boolean) => void;

  constructor() {
    this.promise = new Promise((res) => {
      this.resolve = res;
    });

    setTimeout(() => {
      this.resolve?.(true);
    }, this.reserveAfter);
  }

  public async take(): Promise<boolean> {
    return this.promise;
  }

  public async free(): Promise<boolean> {
    this.resolve?.(false);
    return this.promise;
  }
}
