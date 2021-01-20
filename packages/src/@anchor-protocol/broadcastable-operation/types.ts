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
