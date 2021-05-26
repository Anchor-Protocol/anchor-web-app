import { useMemo } from 'react';
import { ConnectType } from '../types';
import { useWallet } from './useWallet';

export function useInstallChromeExtension() {
  const { availableInstallTypes, install } = useWallet();

  return useMemo<(() => void) | null>(() => {
    return availableInstallTypes.some(
      (type) => type === ConnectType.CHROME_EXTENSION,
    )
      ? () => install(ConnectType.CHROME_EXTENSION)
      : null;
  }, [availableInstallTypes, install]);
}
