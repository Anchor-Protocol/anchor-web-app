import { Extension } from '@terra-money/terra.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StationNetworkInfo, WalletStatus } from './types';
import { WalletContext, WalletProviderProps, WalletState } from './useWallet';

const storage = localStorage;

const WALLET_ADDRESS: string = '__anchor_terra_station_wallet_address__';

async function intervalCheck(
  count: number,
  fn: () => boolean,
  intervalMs: number = 500,
): Promise<boolean> {
  let i: number = -1;
  while (++i < count) {
    if (fn()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}

export function ChromeExtensionWalletProvider({
  children,
}: WalletProviderProps) {
  const extension = useMemo<Extension>(() => new Extension(), []);

  const [status, setStatus] = useState<WalletStatus>(() => ({
    status: 'initializing',
  }));

  const checkStatus = useCallback(
    async (watingExtensionScriptInjection: boolean = false) => {
      const isExtensionInstalled = watingExtensionScriptInjection
        ? await intervalCheck(20, () => extension.isAvailable)
        : extension.isAvailable;

      if (!isExtensionInstalled) {
        setStatus((prev) => {
          if (
            prev.status !== 'initializing' &&
            prev.status !== 'not_installed'
          ) {
            console.error(
              [
                `Abnormal Wallet status change to not_install`,
                `===============================================`,
                JSON.stringify(
                  {
                    'window.isTerraExtensionAvailable':
                      window.isTerraExtensionAvailable,
                  },
                  null,
                  2,
                ),
              ].join('\n'),
            );
          }

          return prev.status !== 'not_installed'
            ? { status: 'not_installed' }
            : prev;
        });
        return;
      }

      const { payload } = await extension.request('info');
      const network: StationNetworkInfo = payload as any;

      const storedWalletAddress: string | null = storage.getItem(
        WALLET_ADDRESS,
      );

      if (storedWalletAddress) {
        if (storedWalletAddress.trim().length > 0) {
          setStatus((prev) => {
            return prev.status !== 'ready' ||
              prev.walletAddress !== storedWalletAddress
              ? {
                  status: 'ready',
                  network,
                  walletAddress: storedWalletAddress,
                }
              : prev;
          });
        } else {
          storage.removeItem(WALLET_ADDRESS);
        }
      } else {
        setStatus((prev) => {
          return prev.status !== 'not_connected'
            ? { status: 'not_connected', network }
            : prev;
        });
      }
    },
    [extension],
  );

  const install = useCallback(() => {
    window.open(
      'https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp',
      '_blank',
    );
  }, []);

  const connect = useCallback(async () => {
    const { name, payload } = await extension.request('connect');

    if (name === 'onConnect' && 'address' in payload) {
      const walletAddress: string = (payload as { address: string }).address;

      storage.setItem(WALLET_ADDRESS, walletAddress);

      await checkStatus();
    }
  }, [checkStatus, extension]);

  const disconnect = useCallback(() => {
    storage.removeItem(WALLET_ADDRESS);
    checkStatus();
  }, [checkStatus]);

  const post = useCallback<WalletState['post']>(
    (data) => {
      return new Promise((resolve) => {
        extension.post({ ...(data as any), purgeQueue: true });
        extension.once('onPost', (payload) => {
          resolve({ name: 'onPost', payload });
        });
      });
      //return extension.request('post', data) as any;
    },
    [extension],
  );

  useEffect(() => {
    checkStatus(true);
  }, [checkStatus]);

  useEffect(() => {
    console.log(
      [
        `Wallet Status`,
        `=======================================`,
        JSON.stringify(status, null, 2),
        JSON.stringify(
          {
            'window.isTerraExtensionAvailable':
              window.isTerraExtensionAvailable,
          },
          null,
          2,
        ),
      ].join('\n'),
    );
  }, [status]);

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
    <WalletContext.Provider value={state}>
      {typeof children === 'function' ? children(state) : children}
    </WalletContext.Provider>
  );
}
