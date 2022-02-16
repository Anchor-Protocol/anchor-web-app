import { interval, of, map, take, concat, Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { StreamReturn, useStream } from '@rx-stream/react';

const createMockObservable = (
  seconds: number,
): Observable<TxResultRendering> => {
  const observale = interval(1000).pipe<number, TxResultRendering>(
    take(seconds + 1),
    map((i) => {
      return {
        value: null,
        phase: i < seconds ? TxStreamPhase.BROADCAST : TxStreamPhase.SUCCEED,
        receipts: [
          {
            name: 'Time taken',
            value: `${i + 1} seconds`,
          },
        ],
      };
    }),
  );
  return concat(
    of({
      value: null,
      phase: TxStreamPhase.BROADCAST,
      receipts: [
        {
          name: 'Time taken',
          value: `0 seconds`,
        },
      ],
    }),
    observale,
  );
};

export function useMockTx<TParams>(
  seconds: number = 5,
): StreamReturn<TParams, TxResultRendering> | [null, null] {
  return useStream(() => createMockObservable(seconds));
}
