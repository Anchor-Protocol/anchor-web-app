import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { Subscription } from 'rxjs';
import { Transaction } from '../storage';
import { errorContains, TxError } from '../utils';
import { TxManager } from './manager';
import { TxState } from './state';
import { BACKGROUND_TRANSCATION_TAB_ID, TxAction } from './utils';

export class TxActor {
  state: TxState;
  manager: TxManager;
  action: TxAction;
  event$: Subscription;

  constructor({
    state,
    action,
    manager,
  }: {
    state: TxState;
    action: TxAction;
    manager: TxManager;
  }) {
    this.state = state;
    this.action = action;
    this.manager = manager;
    this.event$ = action.events.subscribe(this.handleEvent.bind(this));
    this.track();
  }

  public static fromStorage(tx: Transaction, manager: TxManager) {
    const { txEvents, createTx } = manager.handlers.createRestoreTx();

    return new TxActor({
      state: new TxState({ minimized: true, storedTx: tx }),
      action: {
        events: txEvents,
        display: tx.display,
        kind: tx.display.txKind,
        request: createTx(tx.txHash),
      },
      manager,
    });
  }

  public static new(action: TxAction, manager: TxManager) {
    return new TxActor({
      state: new TxState({ minimized: false }),
      action,
      manager,
    });
  }

  public minimize() {
    this.state.minimized = true;
  }

  public update(updates: Partial<Transaction>) {
    this.state.storedTx = {
      ...this.state.storedTx,
      ...updates,
    } as Transaction;

    // persist only if txHash is observed
    if (this.state.storedTx?.txHash) {
      this.manager.storage.save(this.state.storedTx);
    }
  }

  public minimizable() {
    return Boolean(this.state.storedTx?.txHash);
  }

  // private functions

  private async track() {
    try {
      await this.action.request;
      this.manager.handlers.refetch(this.state.storedTx!.display.txKind);

      if (this.state.minimized) {
        this.manager.handlers.pushNotification(this.state.storedTx!);
      }
    } catch (error) {
      if (errorContains(error, TxError.TxAlreadyProcessed)) {
        this.manager.handlers.refetch(this.state.storedTx!.display.txKind);
        return;
      }
      console.log(error);
      throw error;
    } finally {
      this.manager.storage.delete(this.state.storedTx!.txHash);
      this.manager.clear(this);
    }
  }

  private handleEvent(event: CrossChainEvent<ContractReceipt>) {
    // first event with tx in it
    if (event.kind === CrossChainEventKind.IncomingTxSubmitted) {
      const payload = event.payload;
      this.update({
        txHash: payload.txHash,
        lastEventKind: event.kind,
        display: this.action.display,
        backgroundTransactionTabId: BACKGROUND_TRANSCATION_TAB_ID,
      });
      return;
    }

    this.update({ lastEventKind: event.kind });
  }
}
