import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
} from 'react';

export interface AnchorWebappProviderProps {
  children: ReactNode;
}

export interface AnchorWebapp {}

// @ts-ignore
const AnchorWebappContext: Context<AnchorWebapp> = createContext<AnchorWebapp>();

export function AnchorWebappProvider({ children }: AnchorWebappProviderProps) {
  return (
    <AnchorWebappContext.Provider value={{}}>
      {children}
    </AnchorWebappContext.Provider>
  );
}

export function useAnchorWebapp(): AnchorWebapp {
  return useContext(AnchorWebappContext);
}

export const AnchorWebappConsumer: Consumer<AnchorWebapp> =
  AnchorWebappContext.Consumer;
