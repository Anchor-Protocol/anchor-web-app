import {
  TxResultRendering,
  TxStreamPhase,
  TxReceipt,
  TxReceiptLike,
} from '@libs/app-fns';
import { formatEllapsed } from '@libs/formatter';
import { Subject } from 'rxjs';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const mergeUnique = (arr1: TxReceiptLike[], arr2: TxReceiptLike[]) => {
  const arr = arr2.filter(
    (receipt: TxReceiptLike): receipt is TxReceipt => !!receipt,
  );

  return arr1
    .filter(
      (receipt: TxReceiptLike): receipt is TxReceipt =>
        !!receipt && arr.find((t) => t.name === receipt.name) === undefined,
    )
    .concat(arr);
};

class TxProgressTimer<T extends TxResultRendering> {
  private readonly _writer: TxProgressWriter<T>;
  private _epoch: number = 0;
  private _timer: NodeJS.Timer | undefined;

  constructor(writer: TxProgressWriter<T>) {
    this._writer = writer;
  }

  private tick() {
    const ellapsed = new Date().getTime() - this._epoch;

    this._writer.write((current) => {
      const receipts = [...current.receipts];

      const index = receipts.findIndex(
        (receipt) =>
          receipt && 'name' in receipt && receipt.name === 'Time Taken',
      );

      receipts[index < 0 ? receipts.length : index] = {
        name: 'Time Taken',
        value: formatEllapsed(ellapsed),
      };

      return { ...current, receipts };
    });
  }

  public start(ms: number = 500) {
    if (this._timer !== undefined) {
      throw Error('The timer must be stopped before it can be restarted.');
    }
    this._epoch = new Date().getTime();

    this._writer.write((current) => {
      return {
        ...current,
        receipts: [
          ...current.receipts,
          { name: 'Time Taken', value: formatEllapsed(0) },
        ],
      };
    });

    this._timer = setInterval(() => {
      this.tick();
    }, ms);
  }

  public reset() {
    if (this._timer === undefined) {
      throw Error('The timer must be started before it can be reset.');
    }
    this._epoch = new Date().getTime();
  }

  public stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }
}

export class TxProgressWriter<T extends TxResultRendering> {
  private readonly _subject: Subject<T>;
  private _current: T = {
    value: null,
    phase: TxStreamPhase.BROADCAST,
    receipts: [] as TxReceiptLike[],
  } as T;
  public readonly timer: TxProgressTimer<T>;

  constructor(subject: Subject<T>) {
    this._subject = subject;
    this.timer = new TxProgressTimer(this);
  }

  public write(tx: RecursivePartial<T> | ((current: T) => T)) {
    if (typeof tx === 'function') {
      this._current = tx(this._current);
    } else {
      this._current = Object.assign(this._current, tx);
    }
    this._subject.next(this._current);
  }
}
