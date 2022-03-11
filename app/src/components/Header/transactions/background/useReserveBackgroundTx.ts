import { useMemo, useState } from 'react';
import { Transaction, useTransactions } from 'tx/evm';
import { useEffectOnce } from 'usehooks-ts';
import { backgroundTransactionTabId } from '../BackgroundTransaction';
import { useExecuteOnceWhen } from '../utils';

export const useReserveBackgroundTx = (tx: Transaction) => {
  // each tab attemps to "reserve" backgroundTx
  // - attemptAfter(randomInterval between 0-3s)
  // - in the meantime if other browser tab has reserved the tx
  //   (flag will be changed in local storage), reservation is cleared
  //   and background tx isn't invoked
  const [reservationTimeoutId, setReservationTimeoutId] =
    useState<NodeJS.Timer>();
  const reserveAfter = useMemo(() => Math.random() * 2000, []);
  const { updateTransaction } = useTransactions();

  useEffectOnce(() => {
    const timeoutId = setTimeout(() => {
      updateTransaction(tx.receipt.transactionHash, {
        backgroundTransactionTabId,
      });
    }, reserveAfter);
    setReservationTimeoutId(timeoutId);
  });

  useExecuteOnceWhen(
    () => {
      clearTimeout(reservationTimeoutId!);
    },
    () =>
      Boolean(
        reservationTimeoutId &&
          tx.backgroundTransactionTabId &&
          tx.backgroundTransactionTabId !== backgroundTransactionTabId,
      ),
  );
};
