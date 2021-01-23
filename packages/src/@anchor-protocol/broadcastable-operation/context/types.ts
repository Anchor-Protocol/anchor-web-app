import type { ReactNode } from 'react';

export type EventType = 'done';
export type Subscriber = (id: string, event: EventType) => void;
export type Broadcasting = {
  id: string;
  result: OperationResult<any, any>;
  rendering: ReactNode;
};

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
  reset: () => void;
};

export type Fault<Snapshot extends Array<any>> = {
  status: 'fault';
  sanpshots: Snapshot;
  error: unknown;
  reset: () => void;
};

export type OperationResult<Data, Snapshot extends Array<any>> =
  | Ready
  | InProgress<Snapshot>
  | Done<Data, Snapshot>
  | Fault<Snapshot>;

// ---------------------------------------------
// developer interfaces
// ---------------------------------------------
export type Operator<T, R> = (param: T) => Promise<R> | R;

export interface OperationOptions<
  Data,
  Pipe extends Operator<any, any>[],
  Snapshot extends Array<any>
> {
  id?: string | ((id: number) => string);
  broadcastWhen?: 'always' | 'unmounted' | 'none';
  pipe: Pipe;
  renderBroadcast: (props: OperationResult<Data, Snapshot>) => ReactNode;
  breakOnError?: true | ((error: unknown) => boolean);
}
