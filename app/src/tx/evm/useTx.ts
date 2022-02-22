import { StreamReturn, useStream } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import {
  merge,
  from,
  map,
  catchError,
  tap,
  BehaviorSubject,
  Subject,
} from 'rxjs';
import { useCallback, useMemo } from 'react';
import { TxReceipt, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { UserDenied } from '@terra-money/use-wallet';
import { truncateEvm } from '@libs/formatter';

export const useTx = <TxParams>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxResultRendering>,
  ) => Promise<ContractReceipt>,
): StreamReturn<TxParams, TxResultRendering> => {
  const sdkEvents = useMemo(
    () =>
      new BehaviorSubject<TxResultRendering>({
        value: null,
        message: 'Processing transaction...',
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      }),
    [],
  );

  const txCallback = useCallback(
    (txParams: TxParams) => {
      return merge(
        from(sendTx(txParams, sdkEvents))
          .pipe(
            map((tx) => {
              return {
                value: null,
                phase: TxStreamPhase.SUCCEED,
                receipts: [txReceipt(tx)],
              };
            }),
          )
          .pipe(
            catchError((error) => {
              throw error.code === 4001 ? new UserDenied() : error;
            }),
          ),
        sdkEvents,
      ).pipe(
        tap((tx) => {
          console.log('stream emitted', tx);
        }),
      );
    },
    [sdkEvents, sendTx],
  );

  return useStream(txCallback);
};

const txReceipt = (tx: ContractReceipt): TxReceipt => {
  return {
    name: 'Tx hash',
    value: truncateEvm(tx.transactionHash),
  };
};
