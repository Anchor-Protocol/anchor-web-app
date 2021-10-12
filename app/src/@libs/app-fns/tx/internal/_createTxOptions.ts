import { CreateTxOptions } from '@terra-money/terra.js';
import { TxResultRendering, TxStreamPhase } from '../../models/tx';

export function _createTxOptions(tx: CreateTxOptions) {
  return (_: void) => {
    if (tx.fee) {
      const amounts = tx.fee.amount.map((c) => c.amount.toFixed());
      if (amounts.some((n) => n.indexOf('.') > -1)) {
        throw new Error(`tx_fee shouldn't include decimal points`);
      }
    }

    return {
      value: tx,
      phase: TxStreamPhase.POST,
      receipts: [],
    } as TxResultRendering<CreateTxOptions>;
  };
}
