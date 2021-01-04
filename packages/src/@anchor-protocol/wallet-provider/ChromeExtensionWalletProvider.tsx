import { Extension } from '@terra-money/terra.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { WalletStatus } from './types';
import { WalletContext, WalletProviderProps, WalletState } from './useWallet';

const storage = localStorage;

const ADDRESS: string = '__anchor_terra_station_wallet_address__';
const INSTALL_COUNT: string = '__anchor_install_count__';

export function ChromeExtensionWalletProvider({
  children,
}: WalletProviderProps) {
  const extension = useMemo<Extension>(() => new Extension(), []);

  const [status, setStatus] = useState<WalletStatus>(() => ({
    status: 'initializing',
  }));

  const checkStatus = useCallback(() => {
    if (!extension.isAvailable) {
      setStatus({ status: 'not_installed' });
      return;
    }

    const storedAddress: string | null = storage.getItem(ADDRESS);

    if (storedAddress) {
      if (storedAddress.trim().length > 0) {
        setStatus({ status: 'ready', address: storedAddress });
      } else {
        storage.removeItem(ADDRESS);
      }
    } else {
      setStatus({ status: 'not_connected' });
    }
  }, [extension]);

  const install = useCallback(() => {
    const count: number = parseInt(storage.getItem(INSTALL_COUNT) ?? '0');

    if (count > 3) {
      //const result = confirm(`You tried to install many times. Do you have some problem to install?`)
      //
      //if (result) {
      //  // TODO
      //} else {
      //  storage.setItem(INSTALL_COUNT, '0');
      //}
    } else {
      storage.setItem(INSTALL_COUNT, (count + 1).toString());
    }

    window.open(
      'https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp',
      '_blank',
    );
  }, []);

  const connect = useCallback(async () => {
    const { name, payload } = await extension.request('connect');

    if (name === 'onConnect' && 'address' in payload) {
      const address: string = (payload as { address: string }).address;

      storage.setItem(ADDRESS, address);

      checkStatus();
    }
  }, [checkStatus, extension]);

  const disconnect = useCallback(() => {
    storage.removeItem(ADDRESS);
    checkStatus();
  }, [checkStatus]);

  const post = useCallback<WalletState['post']>(
    (data) => {
      return extension.request('post', data) as any;
    },
    [extension],
  );

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const state = useMemo<WalletState>(
    () => ({
      status,
      install,
      connect,
      disconnect,
      post,
      checkStatus,
    }),
    [checkStatus, connect, disconnect, install, post, status],
  );

  return (
    <WalletContext.Provider value={state}>{children}</WalletContext.Provider>
  );
}
