import React, { useEffect } from 'react';
import { UIElementProps } from '@libs/ui';
import { createContext, useMemo } from 'react';
import { useRefCallback } from 'hooks';
import { useTransactionSnackbar } from 'components/Header/transactions/background/useTransactionSnackbar';
import { Transaction, useTransactions } from '../storage';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
} from '../utils';
import { useRefetchQueries } from '@libs/app-provider';
import { createTx } from '../createTx';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { BackgroundTxManager } from '.';

type BackgroundTxContextValue = {
  backgroundTxManager: BackgroundTxManager | undefined;
};

export const BackgroundTxContext = createContext<BackgroundTxContextValue>({
  backgroundTxManager: undefined,
});

export const BackgroundTxProvider = ({ children }: UIElementProps) => {
  const { add: addTxSnackbar } = useTransactionSnackbar();

  const pushNotification = useRefCallback(
    (tx: Transaction) => {
      addTxSnackbar(tx.txHash);
    },
    [addTxSnackbar],
  );

  const {
    saveTransaction,
    removeTransaction,
    updateTransaction,
    transactions,
  } = useTransactions();

  const xAnchor = useEvmCrossAnchorSdk();

  const createRestoreTx = useRefCallback(() => {
    return createTx((txHash: string, handleEvent) =>
      xAnchor.restoreTx(txHash, handleEvent),
    );
  }, [xAnchor]);

  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const refetch = useRefCallback(
    (kind: TxKind) => {
      refetchQueries(refetchQueryByTxKind(kind));
    },
    [refetchQueries],
  );

  const backgroundTxManager = useMemo(
    () =>
      new BackgroundTxManager(
        {
          createRestoreTx,
          refetch,
          pushNotification,
        },
        {
          delete: removeTransaction,
          save: saveTransaction,
          update: updateTransaction,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    transactions.forEach((tx) => backgroundTxManager.trackStoredTx(tx));
  }, [transactions, backgroundTxManager]);

  const value = useMemo(() => ({ backgroundTxManager }), [backgroundTxManager]);

  return (
    <BackgroundTxContext.Provider value={value}>
      {children}
    </BackgroundTxContext.Provider>
  );
};
