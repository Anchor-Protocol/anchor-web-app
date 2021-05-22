import { TxResult } from '@terra-money/wallet-provider';
import { TxHashLink } from '../components/TxHashLink';
import { TransactionResult } from '../models/transaction';
import { Data } from '../queries/txInfos';
import { createElement } from 'react';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

// TODO remove after refactoring done
export function pickEmptyResult({
  txInfo,
  txResult,
}: Params): TransactionResult {
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
    ],
  };
}
