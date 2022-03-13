import React from 'react';
import { Transaction } from 'tx/evm/storage/useTransactions';
import { v4 as uuid } from 'uuid';
import { useResumeBackgroundTx } from './background/useResumeBackgroundTx';

export type BackgroundTransactionProps = { tx: Transaction };

export const BACKGROUND_TRANSCATION_TAB_ID = uuid();

export const BackgroundTransaction = ({ tx }: BackgroundTransactionProps) => {
  useResumeBackgroundTx(tx);
  return <React.Fragment />;
};
