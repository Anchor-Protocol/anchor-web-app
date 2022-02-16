import { interval, of, map, take, concat, Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { StreamReturn, useStream } from '@rx-stream/react';
import { truncateEvm } from '@libs/formatter';

const createMockObservable = (
  seconds: number,
): Observable<TxResultRendering> => {
  const txHash =
    '0x8ad143b5bee3ac2a1578032cdcdc4beb65588ced58b6483728156c9443c704d1';

  const observale = interval(1000).pipe<number, TxResultRendering>(
    take(seconds + 1),
    map((i) => {
      return {
        value: null,
        phase: i < seconds ? TxStreamPhase.BROADCAST : TxStreamPhase.SUCCEED,
        receipts: [
          {
            name: `Tx Hash`,
            value: truncateEvm(txHash),
          },
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
          name: `Tx Hash`,
          value: truncateEvm(txHash),
        },
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
