import { TxResult } from '@anchor-protocol/wallet-provider';
import { TxHashLink } from '../components/TxHashLink';
import { TransactionResult } from '../models/transaction';
import { Data } from '../queries/txInfos';
import { createElement } from 'react';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

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
