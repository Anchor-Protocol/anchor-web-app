import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { CrossAnchorTx } from '.';
import { formatEllapsed } from '@libs/formatter';

export const createObservable =
  (fn: (tx: CrossAnchorTx) => Promise<CrossAnchorTx>, label: string) =>
  (source: TxResultRendering<CrossAnchorTx>) => {
    let { receipts, value: crossAnchorTx } = source;
    return new Observable<TxResultRendering<CrossAnchorTx>>((subscriber) => {
      const observe = async () => {
        let ellapsed = 0;
        const increment = () => {
          subscriber.next({
            value: crossAnchorTx,
            phase: TxStreamPhase.BROADCAST,
            receipts: [
              ...receipts.slice(0, receipts.length - 1),
              {
                name: label,
                value: formatEllapsed(ellapsed),
              },
            ],
          });
          ellapsed++;
        };

        increment();
        const timer = setInterval(increment, 1000);

        // make a callback to the actual function we want to run
        crossAnchorTx = await fn(crossAnchorTx);
        clearInterval(timer);

        subscriber.complete();
      };
      observe();
    });
  };
