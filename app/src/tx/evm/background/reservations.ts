import { Transaction } from '../storage';
import { TxReservation } from './reservation';

export class TxReservations {
  private reservations: { [txHash: string]: TxReservation } = {};

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
