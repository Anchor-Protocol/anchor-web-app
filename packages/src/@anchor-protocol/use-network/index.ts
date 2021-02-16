import { useEffect, useMemo, useState } from 'react';

export interface Network {
  online: boolean;
}

export function useNetwork() {
  const [online, setOnline] = useState<boolean>(() => window.navigator.onLine);

  useEffect(() => {
    function onChange() {
      setOnline(window.navigator.onLine);
    }

    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
  }, []);

  return useMemo(
    () => ({
      online,
    }),
    [online],
  );
}
