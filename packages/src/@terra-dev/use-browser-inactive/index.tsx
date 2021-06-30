import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface BrowserInactiveProviderProps {
  children: ReactNode;
}

export interface BrowserInactive {
  browserInactive: boolean;
}

export const BrowserInactiveContext: Context<BrowserInactive> =
  createContext<BrowserInactive>({
    browserInactive: false,
  });

export function BrowserInactiveProvider({
  children,
}: BrowserInactiveProviderProps) {
  const [browserInactive, setBrowserInactive] = useState<boolean>(
    () => document.hidden,
  );

  useEffect(() => {
    function onVisibilityChange() {
      setBrowserInactive(document.hidden);
    }

    document.addEventListener('visibilitychange', onVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <BrowserInactiveContext.Provider value={{ browserInactive }}>
      {children}
    </BrowserInactiveContext.Provider>
  );
}

export function useBrowserInactive(): BrowserInactive {
  return useContext(BrowserInactiveContext);
}

export const BrowserInactiveConsumer: Consumer<BrowserInactive> =
  BrowserInactiveContext.Consumer;
