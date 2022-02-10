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

// TODO: will relocate this functionality somewhere once
// we get a better idea of how it will all fit together

const deposit = (
  params: AnchorDepositParams,
): Observable<TxResultRendering> => {
  const observable = pipe<void, TxResultRendering>(() => {
    return {
      value: null,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Deposit Amount',
          value: '123.456 UST',
        },
      ],
    };
  });
  return observable();
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
