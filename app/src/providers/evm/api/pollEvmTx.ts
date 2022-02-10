import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { CrossAnchorTx } from '@anchor-protocol/cross-anchor';
import { sleep } from './sleep';
import { formatEllapsed } from '@libs/formatter';

export const pollEvmTx = () => (source: TxResultRendering<CrossAnchorTx>) => {
  // this method polls the tx until the tx has either confirmed or failed
  // once confirmed it passes along the sequence number

  const {
    receipts,
    value: { chainId, txHash },
  } = source;

  return new Observable<TxResultRendering<CrossAnchorTx>>((observer) => {
    const poll = async () => {
      let ellapsed = 0;

      await sleep(1000);

      while (ellapsed < 5) {
        observer.next({
          value: {
            txHash,
            chainId,
          },
          phase: TxStreamPhase.BROADCAST,
          receipts: [
            ...receipts,
            {
              name: 'Confirming',
              value: formatEllapsed(ellapsed),
            },
          ],
        });

        ellapsed++;

        await sleep(1000);
      }

      const sequence = 123;

      observer.next({
        value: {
          txHash,
          chainId,
          inputSequence: sequence,
        },
        phase: TxStreamPhase.BROADCAST,
        receipts: [
          ...receipts,
          {
            name: 'Confirmed',
            value: formatEllapsed(ellapsed),
          },
        ],
      });

      observer.complete();
    };
    poll();
  });
};
