import { TxResult } from '@anchor-protocol/wallet-provider2';
import { Data } from '../queries/txInfos';
import { ReactNode } from 'react';

export interface TransactionResult {
  txInfo: Data;
  txResult: TxResult;

  //txFee: uUST | undefined;
  //txHash: string;

  details: (TransactionDetail | undefined | false | null)[];
}

export interface TransactionDetail {
  name: ReactNode;
  value: ReactNode;
}
