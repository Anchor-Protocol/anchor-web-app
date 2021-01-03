import type { ReactElement, ReactNode } from 'react';
import {
  Context,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

export interface NotifiableFetchProviderProps {
  children: ReactNode;
}

type Subscription = (id: string, notification: ReactElement) => void;

export interface NotifiableFetchState {
  setNotification: (id: string, notification: ReactElement) => void;
  subscribe: (callback: Subscription) => () => void;
  getAbortController: (id: string) => AbortController | undefined;
  setAbortController: (id: string, abortController: AbortController) => void;
  removeAbortController: (id: string) => void;
}

// @ts-ignore
const NotifiableFetchContext: Context<NotifiableFetchState> = createContext<
  NotifiableFetchState
>();

export function NotifiableFetchProvider({
  children,
}: NotifiableFetchProviderProps) {
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const subscriptions = useRef<Set<Subscription>>(new Set());

  const setNotification = useCallback(
    (id: string, notification: ReactElement) => {
      for (const subscription of subscriptions.current) {
        subscription(id, notification);
      }
    },
    [],
  );

  const subscribe = useCallback((subscription: Subscription) => {
    subscriptions.current.add(subscription);

    return () => {
      subscriptions.current.delete(subscription);
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

  const state = useMemo<NotifiableFetchState>(
    () => ({
      setNotification,
      subscribe,
      getAbortController,
      setAbortController,
      removeAbortController,
    }),
    [
      getAbortController,
      removeAbortController,
      setAbortController,
      setNotification,
      subscribe,
    ],
  );

  return (
    <NotifiableFetchContext.Provider value={state}>
      {children}
    </NotifiableFetchContext.Provider>
  );
}

export function useNotifiableFetchInternal(): NotifiableFetchState {
  return useContext(NotifiableFetchContext);
}