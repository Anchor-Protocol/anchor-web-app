import React, { useMemo } from 'react';
import { UIElementProps } from '@libs/ui';
import {
  AnchorApiContext,
  AnchorDepositParams,
  AnchorWithdrawParams,
} from 'contexts/api';
import { Observable } from 'rxjs';
import { pipe } from '@rx-stream/pipe';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import {
  catchTxError,
  CrossAnchorTx,
  pollTx,
} from '../../@anchor-protocol/cross-anchor';
import { truncate } from '@libs/formatter';

// TODO: will relocate this functionality somewhere once
// we get a better idea of how it will all fit together

const createTx = () => (_: void | TxResultRendering<CrossAnchorTx>) => {
  const txHash =
    '0x8ad143b5bee3ac2a1578032cdcdc4beb65588ced58b6483728156c9443c704d1';
  return {
    value: {
      txHash,
      chainId: 123,
    },
    phase: TxStreamPhase.BROADCAST,
    receipts: [
      {
        name: `Tx Hash`,
        value: truncate(txHash, [10, 10]),
      },
    ],
  };
};

const deposit = (
  params: AnchorDepositParams,
): Observable<TxResultRendering<CrossAnchorTx>> => {
  const observable = pipe(createTx(), pollTx(3));
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
