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
  oracleFeedResumeTime: string;
}

// @ts-ignore
const FlagsContext: Context<Flags> = createContext<Flags>();

export function FlagsProvider({ children }: FlagsProviderProps) {
  const [flags] = useState<Flags>(() => ({
    maintenanceDownBlock: -1,
    forceMaintenanceDown: false,
    useExternalOraclePrice: true,
    oracleFeedResumeTime: 'Thu Sep 30 2021 xx:xx:xx UTC',
  }));

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
}

export function useFlags(): Flags {
  return useContext(FlagsContext);
}

export const FlagsConsumer: Consumer<Flags> = FlagsContext.Consumer;
