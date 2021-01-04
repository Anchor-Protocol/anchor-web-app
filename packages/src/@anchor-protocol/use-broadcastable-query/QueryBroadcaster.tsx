import type { ReactElement, ReactNode } from 'react';
import {
  Context,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

export interface QueryBroadcasterProps {
  children: ReactNode;
}

type WatchCallback = (id: string, notification: ReactElement) => void;

export interface QueryBroadcasterState {
  broadcast: (id: string, notification: ReactElement) => void;
  watch: (callback: WatchCallback) => () => void;
  getAbortController: (id: string) => AbortController | undefined;
  setAbortController: (id: string, abortController: AbortController) => void;
  removeAbortController: (id: string) => void;
}

// @ts-ignore
const QueryBroadcasterContext: Context<QueryBroadcasterState> = createContext<
  QueryBroadcasterState
>();

export function QueryBroadcaster({ children }: QueryBroadcasterProps) {
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const watchCallbacks = useRef<Set<WatchCallback>>(new Set());

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
      getAbortController,
      setAbortController,
      removeAbortController,
    }),
    [
      getAbortController,
      removeAbortController,
      setAbortController,
      broadcast,
      watch,
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
