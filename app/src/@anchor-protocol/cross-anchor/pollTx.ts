import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { CrossAnchorTx } from '.';

// this will poll the CrossAnchor Bridge API to track the status of a tx

const sleep = (ms: number) => new Promise((f) => setTimeout(f, ms));

export const pollTx = () => (source: TxResultRendering<CrossAnchorTx>) => {
  const {
    receipts,
    value: { chainId, txHash },
  } = source;
  return new Observable<TxResultRendering<CrossAnchorTx>>((observer) => {
    const run = async () => {
      await sleep(1500);

      observer.next({
        value: {
          txHash,
          chainId,
        },
        phase: TxStreamPhase.POST,
        receipts: [
          ...receipts,
          {
            name: 'Anchor Bridge',
            value: 'Pending',
          },
        ],
      });

      await sleep(1500);

      observer.next({
        value: {
          txHash,
          chainId,
        },
        phase: TxStreamPhase.POST,
        receipts: [
          ...receipts,
          {
            name: 'Anchor Bridge',
            value: 'Confirmed',
          },
        ],
      });

      await sleep(1500);

      observer.next({
        value: {
          txHash,
          chainId,
        },
        phase: TxStreamPhase.POST,
        receipts: [
          ...receipts,
          {
            name: 'Anchor Bridge',
            value: 'Deposited',
          },
        ],
      });

      await sleep(1500);

      observer.next({
        value: {
          txHash,
          chainId,
        },
        phase: TxStreamPhase.POST,
        receipts: [
          ...receipts,
          {
            name: 'Anchor Bridge',
            value: 'Completing',
          },
        ],
      });

      await sleep(1500);

      observer.next({
        value: {
          txHash,
          chainId,
        },
        phase: TxStreamPhase.SUCCEED,
        receipts: [...receipts],
      });

      observer.complete();
    };
    run();
  });
};

// export const pollTx =
//   (n: number) => (source: TxResultRendering<CrossAnchorTx>) => {
//     const {
//       receipts,
//       value: { chainId, txHash },
//     } = source;
//     return new Observable<TxResultRendering<CrossAnchorTx>>((observer) => {
//       const run = async () => {
//         for (let i = 1; i <= n; i++) {
//           observer.next({
//             value: {
//               txHash,
//               chainId,
//             },
//             phase: TxStreamPhase.POST,
//             receipts: [
//               ...receipts,
//               {
//                 name: `Label ${i}`,
//                 value: i.toString(),
//               },
//             ],
//           });
//           await new Promise((f) => setTimeout(f, 1500));
//         }

//         observer.next({
//           value: {
//             txHash,
//             chainId,
//           },
//           phase: TxStreamPhase.SUCCEED,
//           receipts: [...receipts],
//         });

//         observer.complete();
//       };
//       run();
//     });
//   };
