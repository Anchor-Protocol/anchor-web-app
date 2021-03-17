import type { GlobalDependency } from '@terra-dev/broadcastable-operation/global';
import type { ReactNode } from 'react';

export type EventType = 'done';
export type Subscriber = (id: string, event: EventType) => void;
export type Broadcasting = {
  id: string;
  result: OperationResult<any, any>;
  rendering: ReactNode;
  /** JS Time (e.g. Date.getTime()) */
  from: number;
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
//export type OperatorOption = {
//  signal: AbortSignal;
//};

export type InternalDependency = {
  signal: AbortSignal;
  storage: Map<string, any>;
};

//option: OperatorOption,
export type Operator<T, R> = (param: T) => Promise<R> | R;

export type OperationDependency<D extends {} = {}> = D &
  GlobalDependency &
  InternalDependency;

export interface OperationOptions<
  Data,
  DependdencyList extends {},
  Pipe extends Operator<any, any>[],
  Snapshot extends Array<any>
> {
  id?: string | ((id: number) => string);
  broadcastWhen?: 'always' | 'unmounted' | 'none';
  pipe: (deps: OperationDependency<DependdencyList>) => Pipe;
  renderBroadcast: (props: OperationResult<Data, Snapshot>) => ReactNode;
  breakOnError?: true | ((error: unknown) => boolean);
}
