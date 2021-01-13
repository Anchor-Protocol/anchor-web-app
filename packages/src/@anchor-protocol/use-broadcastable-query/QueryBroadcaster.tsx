import type { DependencyList, ReactElement, ReactNode } from 'react';
import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

export interface QueryBroadcasterProps {
  children: ReactNode;
}

type EventTypes = 'done';
type WatchCallback = (id: string, notification: ReactElement) => void;
type Subscriber = (id: string, event: EventTypes) => void;

export interface QueryBroadcasterState {
  broadcast: (id: string, notification: ReactElement) => void;
  watch: (callback: WatchCallback) => () => void;
  dispatch: (id: string, event: EventTypes) => void;
  subscribe: (subscriber: Subscriber) => () => void;
  getAbortController: (id: string) => AbortController | undefined;
  setAbortController: (id: string, abortController: AbortController) => void;
  removeAbortController: (id: string) => void;
}

// @ts-ignore
const QueryBroadcasterContext: Context<QueryBroadcasterState> = createContext<QueryBroadcasterState>();

export function QueryBroadcaster({ children }: QueryBroadcasterProps) {
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const watchCallbacks = useRef<Set<WatchCallback>>(new Set());
  const subscribers = useRef<Set<Subscriber>>(new Set());

  const broadcast = useCallback((id: string, notification: ReactElement) => {
    for (const callback of watchCallbacks.current) {
      callback(id, notification);
    }
  }, []);

  const watch = useCallback((callback: WatchCallback) => {
    watchCallbacks.current.add(callback);

    return () => {
      watchCallbacks.current.delete(callback);
    };
  }, []);

  const subscribe = useCallback((subscriber: Subscriber) => {
    subscribers.current.add(subscriber);

    return () => {
      subscribers.current.delete(subscriber);
    };
  }, []);

  const dispatch = useCallback((id: string, event: EventTypes) => {
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

  const state = useMemo<QueryBroadcasterState>(
    () => ({
      broadcast,
      watch,
      subscribe,
      dispatch,
      getAbortController,
      setAbortController,
      removeAbortController,
    }),
    [
      broadcast,
      watch,
      subscribe,
      dispatch,
      getAbortController,
      setAbortController,
      removeAbortController,
    ],
  );

  return (
    <QueryBroadcasterContext.Provider value={state}>
      {children}
    </QueryBroadcasterContext.Provider>
  );
}

export function useQueryBroadcaster(): QueryBroadcasterState {
  return useContext(QueryBroadcasterContext);
}

export function useQuerySubscription(
  subscriber: (id: string, event: EventTypes) => void,
  deps: DependencyList,
) {
  const { subscribe } = useContext(QueryBroadcasterContext);

  useEffect(() => {
    const teardown = subscribe(subscriber);

    return () => {
      teardown();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
