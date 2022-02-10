import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import {
  AnchorApiContext,
  AnchorDepositParams,
  // AnchorDepositParams,
  AnchorWithdrawParams,
} from 'contexts/api';
import {
  // interval,
  Observable,
  of,
} from 'rxjs';
// import { map } from 'rxjs/operators';
import { pipe } from '@rx-stream/pipe';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
// import { useDeposit } from './api/useDeposit';
// import { useApproveDeposit } from './api/useApproveDeposit';
import {
  catchTxError,
  CrossAnchorTx,
  pollCrossAnchorTx,
} from '@anchor-protocol/cross-anchor';
import { pollEvmTx } from './api/pollEvmTx';
import { createEvmTx } from './api/createEvmtx';

const deposit = (
  params: AnchorDepositParams,
): Observable<TxResultRendering<CrossAnchorTx>> => {
  const observable = pipe(
    createEvmTx(),
    pollEvmTx(),
    pollCrossAnchorTx(),
    (source: TxResultRendering<CrossAnchorTx>) =>
      of({
        ...source,
        phase: TxStreamPhase.SUCCEED,
      }),
  );

  return observable().pipe(catchTxError({}));
};

const withdraw = (
  params: AnchorWithdrawParams,
): Observable<TxResultRendering> => {
  const observable = pipe<void, TxResultRendering>(() => {
    return {
      value: null,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Withdraw Amount',
          value: '100.50 UST',
        },
      ],
    };
  });
  return observable();
};

const EvmAnchorApiProvider = ({ children }: UIElementProps) => {
  // const deposit = useDeposit();
  // const approveDeposit = useApproveDeposit();

  // const api = useMemo(() => {
  //   return { approveDeposit, deposit, withdraw };
  // }, [approveDeposit, deposit]);

  const api = useMemo(() => {
    return { deposit, withdraw };
  }, []);

  return (
    <AnchorApiContext.Provider value={api}>
      {children}
    </AnchorApiContext.Provider>
  );
};

export { EvmAnchorApiProvider };
