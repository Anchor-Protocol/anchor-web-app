import { useEffect, useMemo, useState } from 'react';
import { Transaction } from 'tx/evm';
import { useBackgroundTransactions } from 'tx/evm/storage/useBackgroundTransactions';
import { useEventListener } from 'usehooks-ts';
import { BACKGROUND_TRANSCATION_TAB_ID } from '../BackgroundTransaction';
import { useExecuteOnceWhen } from '../utils';

export const useReserveBackgroundTx = (tx: Transaction) => {
  // each tab attemps to "reserve" backgroundTx
  // - attemptAfter(randomInterval between 0-10s)
  // - in the meantime if other browser tab has reserved the tx
  //   (flag will be changed in local storage), reservation is cleared
  //   and background tx isn't invoked
  const [reservationTimeoutId, setReservationTimeoutId] =
    useState<NodeJS.Timer>();
  const reserveAfter = useMemo(() => Math.random() * 5000, []);
  const { reserveBackgroundTx, unReserveBackgroundTx } =
    useBackgroundTransactions();

  useEventListener('beforeunload', (e) => {
    unReserveBackgroundTx(tx);
  });

  useEffect(() => {
    // reattempt reservation on empty slot
    if (tx.backgroundTransactionTabId === null) {
      const timeoutId = setTimeout(() => {
        reserveBackgroundTx(tx);
      }, reserveAfter);
      setReservationTimeoutId(timeoutId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx.backgroundTransactionTabId]);

  useExecuteOnceWhen(
    () => {
      clearTimeout(reservationTimeoutId!);
    },
    () =>
      Boolean(
        reservationTimeoutId &&
          tx.backgroundTransactionTabId &&
          tx.backgroundTransactionTabId !== BACKGROUND_TRANSCATION_TAB_ID,
      ),
  );
};
