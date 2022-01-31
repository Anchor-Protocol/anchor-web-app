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
//import { _catchTxError } from '@libs/app-fns/tx/internal';

// TODO: will relocate this functionality somewhere once
// we get a better idea of how it will all fit together

//const takeEveryNthSimple = (n: number) => <T>(source: Observable<T>) => source.pipe(filter((value, index) => index % n === 0 ));

// const a = (n: number) => (_: void) => {
//   console.log(_)
//   return {
//     value: 1,
//     phase: TxStreamPhase.SUCCEED,
//     receipts: [
//       {
//         name: `Withdraw Amount ${n}`,
//         value: n.toString(),
//       },
//     ],
//   } as TxResultRendering<number>;
// }

const deposit = (
  params: AnchorDepositParams,
): Observable<TxResultRendering> => {
  // const observable = pipe<void, TxResultRendering>(() => {
  //   return {
  //     value: null,
  //     phase: TxStreamPhase.SUCCEED,
  //     receipts: [
  //       {
  //         name: 'Deposit Amount',
  //         value: '123.456 UST',
  //       },
  //     ],
  //   };
  // });
  // return observable();

  // const observable = interval(1000).pipe<TxResultRendering>(
  //   map((i) => {
  //     return {
  //       value: null,
  //       phase: TxStreamPhase.BROADCAST,
  //       receipts: [
  //         {
  //           name: 'Time taken',
  //           value: `${i} seconds`,
  //         },
  //       ],
  //     };
  //   }),
  // );
  // return observable;

  // const catchTxError = (): OperatorFunction<any, any> => {
  //   return catchError((error) => {
  //     console.log(error)
  //     return Promise.resolve<TxResultRendering>({
  //       value: null,
  //       phase: TxStreamPhase.FAILED,
  //       failedReason: { error },
  //       receipts: [],
  //     });
  //   });
  // }

  // const a = (n: number) => (_: void) => {
  //   return {
  //     value: 2,
  //     phase: TxStreamPhase.SUCCEED,
  //     receipts: [
  //       {
  //         name: `Withdraw Amount ${n}`,
  //         value: n.toString(),
  //       },
  //     ],
  //   } as TxResultRendering<number>;
  // }

  // console.log('b1')

  // const observable = pipe(a(1), (t) => a(2), (t) => a(3));
  // // const observable2 = pipe(a(2));
  // // const observable3 = pipe(a(3));

  // console.log('b2')

  // // const observable = merge(observable1(), observable2(), observable3())

  // return observable().pipe(catchTxError());

  // const observable = pipe(
  //   () => ({
  //     value: 1,
  //     phase: TxStreamPhase.SUCCEED,
  //     receipts: [
  //       {
  //         name: "1",
  //         value: "1",
  //       },
  //     ],
  //   } as TxResultRendering<number>),
  //   () => ({
  //     value: 2,
  //     phase: TxStreamPhase.SUCCEED,
  //     receipts: [
  //       {
  //         name: "2",
  //         value: "2",
  //       },
  //     ],
  //   } as TxResultRendering<number>),
  //   () => ({
  //     value: 2,
  //     phase: TxStreamPhase.SUCCEED,
  //     receipts: [
  //       {
  //         name: "3",
  //         value: "3",
  //       },
  //     ],
  //   } as TxResultRendering<number>)
  // )

  // return observable(undefined).pipe(catchTxError());

  // const observable = pipe(
  //   a(1),
  //   a(2),
  //   a(3),
  //   a(4),
  // )

  //return observable(undefined).pipe(catchTxError());

  const observable = new Observable<TxResultRendering<number>>((observer) => {
    observer.next({
      value: 11,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Withdraw Amount 1',
          value: '100.50 UST',
        },
      ],
    });
    observer.next({
      value: 22,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Withdraw Amount 2',
          value: '100.50 UST',
        },
      ],
    });
    observer.next({
      value: 33,
      phase: TxStreamPhase.SUCCEED,
      receipts: [
        {
          name: 'Withdraw Amount 3',
          value: '100.50 UST',
        },
      ],
    });
  });

  return observable;

  // const aa = merge(pipe(a(1)), observable);

  // return aa;
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
