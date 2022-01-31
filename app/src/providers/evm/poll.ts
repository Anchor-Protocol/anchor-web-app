import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';

export const poll =
  (n: number) => (source: Observable<TxResultRendering<number>>) => {
    console.log('poll');
    return new Observable<TxResultRendering<number>>((observer) => {
      console.log('asdlkjasldj');
      for (let i = 0; i < n; i++) {
        observer.next({
          value: 1,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            {
              name: `Withdraw Amount ${i}`,
              value: i.toString(),
            },
          ],
        });
      }
    });
  };
