import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  const [flags, setFlags] = useState<Flags>(() => ({
    maintenanceDownBlock: -1,
    forceMaintenanceDown: false,
    useExternalOraclePrice: false,
  }));

  useEffect(() => {
    function task() {
      fetch(
        'https://raw.githubusercontent.com/Anchor-Protocol/anchor-web-assets/main/flags.json',
      )
        .then((res) => res.json())
        .then(setFlags);
    }

    task();

    const intervalId = setInterval(task, 1000 * 10);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
}

export function useFlags(): Flags {
  return useContext(FlagsContext);
}

export const FlagsConsumer: Consumer<Flags> = FlagsContext.Consumer;
