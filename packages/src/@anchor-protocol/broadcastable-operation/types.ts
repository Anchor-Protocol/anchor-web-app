import big, { Big, BigSource } from 'big.js';
import type { ReactNode } from 'react';

export type Operator<T, R> = (param: T) => Promise<R> | R;

export type Ready = {
  status: 'ready';
};

export type InProgress = {
  status: 'in-progress';
  abort: () => void;
};

export type Done<Data, Snapshot extends Array<any>> = {
  status: 'done';
  data: Data;
  snapshots: Snapshot;
  close: () => void;
};

export type OperationResult<Data, Snapshot extends Array<any>> =
  | Ready
  | InProgress
  | Done<Data, Snapshot>;

export interface OperationOptions<
  Data,
  Pipe extends Operator<any, any>[],
  Snapshot extends Array<any>
> {
  id?: string;
  broadcastableWhen?: 'always' | 'unmounted' | 'none';
  timeout?: number;
  pipe: Pipe;
  renderBroadcast: (
    props: Ready | InProgress | Done<Data, Snapshot>,
  ) => ReactNode;
}

export type OperationReturn<T, Data, Snapshot extends Array<any>> = [
  exec: (param: T) => void,
  result: OperationResult<Data, Snapshot> | undefined,
  reset: (() => void) | undefined,
];

//type InferTest<T> = T extends Promise<infer R> ?

function process<O>(
  operator: O,
): O extends Promise<infer R>
  ? 'promise'
  : O extends AsyncIterator<infer R, infer Y>
  ? 'iterator'
  : O {
  throw 'not implemented';
}

async function* gen() {
  yield 1;
  yield 2;
  yield 3;
  return '10';
}

async function pro() {
  return 1;
}

const x = process(gen());
const y = process(pro());

console.log('types.ts..()', x, y);

type Currency<
  T extends
    | 'uluna'
    | 'ubluna'
    | 'uaust'
    | 'uust'
    | 'luna'
    | 'bluna'
    | 'ust'
    | 'aust'
> = { __nominal: T };

type uLuna<T = string> = T & Currency<'uluna'>;
type ubLuna<T = string> = T & Currency<'ubluna'>;
type uaUST<T = string> = T & Currency<'uaust'>;
type uUST<T = string> = T & Currency<'uust'>;
type Luna<T = string> = T & Currency<'luna'>;
type bLuna<T = string> = T & Currency<'bluna'>;
type aUST<T = string> = T & Currency<'aust'>;
type UST<T = string> = T & Currency<'aust'>;

const amount: uLuna = '100' as uLuna;

// @ts-expect-error
const xx: ubLuna = amount as ubLuna;

function exchange(amount: aUST): UST<BigSource> {
  return big(amount).mul(0.2) as UST<BigSource>;
}
