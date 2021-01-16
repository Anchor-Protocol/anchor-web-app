import { useEffect, useState } from 'react';

export function useWasm<T>(libImport: Promise<T>): T | undefined {
  const [lib, setLib] = useState<T | undefined>();

  useEffect(() => {
    libImport.then(setLib);
  }, [libImport]);

  return lib;
}