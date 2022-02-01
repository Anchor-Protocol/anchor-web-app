import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { CrossAnchorTx } from '.';

export const pollTx =
  (n: number) => (source: TxResultRendering<CrossAnchorTx>) => {
    const {
      receipts,
      value: { chainId, txHash },
    } = source;
    return new Observable<TxResultRendering<CrossAnchorTx>>((observer) => {
      const run = async () => {
        for (let i = 1; i <= n; i++) {
          observer.next({
            value: {
              txHash,
              chainId,
            },
            phase: TxStreamPhase.POST,
            receipts: [
              ...receipts,
              {
                name: `Label ${i}`,
                value: i.toString(),
              },
            ],
          });
          await new Promise((f) => setTimeout(f, 1500));
        }

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
