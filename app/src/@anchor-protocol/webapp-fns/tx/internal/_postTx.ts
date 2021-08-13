import { txTimeout } from '@terra-dev/tx-helpers';
import { TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import { TxResultRendering, TxStreamPhase } from '@terra-money/webapp-fns';
import { TxHelper } from './TxHelper';

interface Params {
  helper: TxHelper;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
}

export function _postTx({ helper, post }: Params) {
  return ({ value: tx }: TxResultRendering<CreateTxOptions>) => {
    helper.saveTx(tx);
    return Promise.race<TxResult>([post(tx), txTimeout<TxResult>()]).then(
      (txResult) => {
        helper.saveTxResult(txResult);
        return {
          value: txResult,

          phase: TxStreamPhase.BROADCAST,
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering<TxResult>;
      },
    );
  };
}
