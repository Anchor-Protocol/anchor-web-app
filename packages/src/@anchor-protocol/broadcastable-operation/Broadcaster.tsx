import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext } from 'react';

export interface BroadcasterProps {
  children: ReactNode;
}

export interface BroadcasterState {
  broadcast: (id: string, rendering: ReactNode, timeout: number) => void;
  getAbortController: (id: string) => AbortController;
  removeAbortController: (id: string) => void;
  broadcastedRenderings: ReactNode[];
}

// @ts-ignore
const BroadcasterContext: Context<BroadcasterState> = createContext<BroadcasterState>();

export function Broadcaster({ children }: BroadcasterProps) {
  return (
    <BroadcasterContext.Provider value={{} as any}>
      {children}
    </BroadcasterContext.Provider>
  );
}

export function useBroadcaster(): BroadcasterState {
  return useContext(BroadcasterContext);
}

export const BroadcasterConsumer: Consumer<BroadcasterState> =
  BroadcasterContext.Consumer;
