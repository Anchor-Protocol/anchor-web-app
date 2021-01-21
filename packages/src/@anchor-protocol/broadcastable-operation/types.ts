import type { ReactNode } from 'react';

// ---------------------------------------------
// result types
// ---------------------------------------------
export type Ready = {
  status: 'ready';
};

export type InProgress<Snapshot extends Array<any>> = {
  status: 'in-progress';
  snapshots: Snapshot;
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
  | InProgress<Snapshot>
  | Done<Data, Snapshot>;

// ---------------------------------------------
// developer interfaces
// ---------------------------------------------
export type Operator<T, R> = (param: T) => Promise<R> | R;

export interface OperationOptions<
  Data,
  Pipe extends Operator<any, any>[],
  Snapshot extends Array<any>
> {
  id?: string;
  broadcastableWhen?: 'always' | 'unmounted' | 'none';
  pipe: Pipe;
  renderBroadcast: (props: OperationResult<Data, Snapshot>) => ReactNode;
  timeout?: number;
}

export type OperationReturn<T, Data, Snapshot extends Array<any>> = [
  exec: (param: T) => void,
  result: OperationResult<Data, Snapshot> | undefined,
  reset: (() => void) | undefined,
];
