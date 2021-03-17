import type { GlobalDependency } from '@terra-dev/broadcastable-operation/global';
import { produce } from 'immer';
import {
  Context,
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Broadcasting, EventType, OperationResult, Subscriber } from './types';

export interface OperationBroadcasterProps {
  children: ReactNode;
  dependency: GlobalDependency;
  errorReporter?: (error: unknown) => void;
}

export interface OperationBroadcasterState {
  // broadcast
  broadcast: (
    id: string,
    result: OperationResult<any, any>,
    rendering: ReactNode,
  ) => void;
  stopBroadcast: (...ids: string[]) => void;
  broadcasting: Broadcasting[];
  // events
  dispatch: (id: string, event: EventType) => void;
  subscribe: (subscriber: Subscriber) => () => void;
  // abort controllers
  getAbortController: (id: string) => AbortController | undefined;
  setAbortController: (id: string, abortController: AbortController) => void;
  removeAbortController: (id: string) => void;
  // deps
  globalDependency: MutableRefObject<GlobalDependency>;
  // error reporter
  errorReporter?: (error: unknown) => void;
}

// @ts-ignore
const OperationBroadcasterContext: Context<OperationBroadcasterState> = createContext<OperationBroadcasterState>();

export function OperationBroadcaster({
  children,
  dependency,
}: OperationBroadcasterProps) {
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const subscribers = useRef<Set<Subscriber>>(new Set());
  const globalDependency = useRef<GlobalDependency>(dependency);

  useEffect(() => {
    globalDependency.current = dependency;
  }, [dependency]);

  const [broadcasting, setBroadcasting] = useState<Broadcasting[]>(() => []);

  const broadcast = useCallback(
    (id: string, result: OperationResult<any, any>, rendering: ReactNode) => {
      setBroadcasting((prev) => {
        const index = prev.findIndex((r) => r.id === id);

        return produce(prev, (draft) => {
          const b: Broadcasting = { id, result, rendering, from: Date.now() };

          if (index > -1) {
            draft[index] = b;
          } else {
            draft.push(b);
          }
        });
      });
    },
    [],
  );

  const stopBroadcast = useCallback((...ids: string[]) => {
    if (ids.length === 0) return;

    setBroadcasting((prev) => {
      const deleteList = new Set(ids);
      const next = prev.filter(({ id }) => !deleteList.has(id));

      return next.length !== prev.length ? next : prev;
    });
  }, []);

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current.add(subscriber);

    return () => {
      subscribers.current.delete(subscriber);
    };
  }, []);

  const dispatch = useCallback((id: string, event: EventType) => {
    for (const subscriber of subscribers.current) {
      subscriber(id, event);
    }
  }, []);

  const getAbortController = useCallback((id: string) => {
    return abortControllers.current.get(id);
  }, []);

  const setAbortController = useCallback(
    (id: string, abortController: AbortController) => {
      abortControllers.current.set(id, abortController);
    },
    [],
  );

  const removeAbortController = useCallback((id: string) => {
    abortControllers.current.delete(id);
  }, []);

  const state = useMemo<OperationBroadcasterState>(
    () => ({
      broadcast,
      stopBroadcast,
      broadcasting: broadcasting,
      subscribe,
      dispatch,
      getAbortController,
      setAbortController,
      removeAbortController,
      globalDependency,
    }),
    [
      broadcast,
      stopBroadcast,
      broadcasting,
      subscribe,
      dispatch,
      getAbortController,
      setAbortController,
      removeAbortController,
    ],
  );

  return (
    <OperationBroadcasterContext.Provider value={state}>
      {children}
    </OperationBroadcasterContext.Provider>
  );
}

export function useOperationBroadcaster(): OperationBroadcasterState {
  return useContext(OperationBroadcasterContext);
}
