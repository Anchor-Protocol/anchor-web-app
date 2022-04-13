import { Transaction } from '../storage';
import { TxActor } from './actor';
import { TxReservations } from './reservations';
import {
  BACKGROUND_TRANSCATION_TAB_ID,
  TxAction,
  TxHandlers,
  TxStorage,
} from './utils';

export class TxManager {
  actors: TxActor[] = [];
  handlers: TxHandlers;
  storage: TxStorage;
  reservations: TxReservations;

  constructor(handlers: TxHandlers, storage: TxStorage) {
    this.handlers = handlers;
    this.reservations = new TxReservations();
    this.storage = storage;

    // free all active actors in current tab on page reload
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  public static fromStorage(
    txs: Transaction[],
    handlers: TxHandlers,
    storage: TxStorage,
  ) {
    const manager = new TxManager(handlers, storage);
    txs.forEach((tx) => manager.trackStoredTx(tx));
    return manager;
  }

  // - subscribe to transaction storage changes
  //   - on each new transaction, attempt reservation
  //   - if reservation successful, create actor
  // - on new "main" transactions
  //   - create actor (assume reserved by default)
  public async trackStoredTx(tx: Transaction) {
    if (this.canReserve(tx)) {
      this.reservations.add(tx);
      const reserved = await this.reservations.get(tx).take();

      if (reserved) {
        this.reservations.remove(tx);
        const newActor = TxActor.fromStorage(tx, this);
        newActor.update({
          backgroundTransactionTabId: BACKGROUND_TRANSCATION_TAB_ID,
        });
        this.actors = [...this.actors, newActor];
      }

      return;
    }

    if (this.alreadyReserved(tx)) {
      this.reservations.get(tx).free();
      this.reservations.remove(tx);
    }
  }

  public trackNewTx(action: TxAction) {
    const newActor = TxActor.new(action, this);
    this.actors = [...this.actors, newActor];
    return newActor;
  }

  public update(txHash: string, updates: Partial<Transaction>) {
    if (this.contains(txHash)) {
      const txActor = this.get(txHash)!;
      txActor.update(updates);
    }
  }

  public contains(txHash: string) {
    return Boolean(this.get(txHash));
  }

  public get(txHash: string) {
    return this.actors.find((a) => a.state.storedTx?.txHash === txHash);
  }

  public clear(actor: TxActor) {
    this.actors = this.actors.filter((a) => a !== actor);
  }

  public destroy() {
    this.actors.forEach((actor) => {
      actor.destroy();
    });
  }

  // private functions
  private canReserve(tx: Transaction) {
    return (
      !this.contains(tx.txHash) &&
      !this.reservations.contains(tx) &&
      !tx.backgroundTransactionTabId
    );
  }

  private alreadyReserved(tx: Transaction) {
    return (
      !this.contains(tx.txHash) &&
      this.reservations.contains(tx) &&
      tx.backgroundTransactionTabId &&
      tx.backgroundTransactionTabId !== BACKGROUND_TRANSCATION_TAB_ID
    );
  }
}
