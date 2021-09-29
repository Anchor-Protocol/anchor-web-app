import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

export interface FlagsProviderProps {
  children: ReactNode;
}

export interface Flags {
  maintenanceDownBlock: number;
  forceMaintenanceDown: boolean;
  useExternalOraclePrice: boolean;
}

// @ts-ignore
const FlagsContext: Context<Flags> = createContext<Flags>();

export function FlagsProvider({ children }: FlagsProviderProps) {
  const [flags] = useState<Flags>(() => ({
    maintenanceDownBlock: -1,
    forceMaintenanceDown: false,
    useExternalOraclePrice: true,
  }));

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
}

export function useFlags(): Flags {
  return useContext(FlagsContext);
}

export const FlagsConsumer: Consumer<Flags> = FlagsContext.Consumer;
