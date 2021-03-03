import type { HumanAddr } from '@anchor-protocol/types/contracts';
import { Extension } from '@terra-money/terra.js';
import { getParser } from 'bowser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UserDeniedError } from './errors';
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
  defaultNetwork,
}: WalletProviderProps) {
  const isChrome = useMemo(() => {
    const browser = getParser(navigator.userAgent);
    return browser.satisfies({
      chrome: '>60',
      edge: '>80',
    });
  }, []);

  const extension = useMemo<Extension>(() => new Extension(), []);

  const [status, setStatus] = useState<WalletStatus>(() => ({
    status: isChrome ? 'initializing' : 'unavailable',
    network: defaultNetwork,
  }));

  const firstCheck = useRef<boolean>(false);

  const checkStatus = useCallback(
    async (watingExtensionScriptInjection: boolean = false) => {
      if (!isChrome) {
        return;
      }

      if (!watingExtensionScriptInjection && !firstCheck.current) {
        return;
      }

      const isExtensionInstalled = watingExtensionScriptInjection
        ? await intervalCheck(20, () => extension.isAvailable)
        : extension.isAvailable;

      firstCheck.current = true;

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
            ? { status: 'not_installed', network: defaultNetwork }
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
                  walletAddress: storedWalletAddress as HumanAddr,
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
    [defaultNetwork, extension, isChrome],
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

  const postResolvers = useRef(
    new Map<number, [(data: any) => void, (error: any) => void]>(),
  );

  useEffect(() => {
    extension.on('onPost', ({ error, ...payload }) => {
      if (!postResolvers.current.has(payload.id)) {
        return;
      }

      const [resolve, reject] = postResolvers.current.get(payload.id)!;

      if (error && 'code' in error && error.code === 1 && reject) {
        reject(new UserDeniedError());
      } else if (resolve) {
        resolve({ name: 'onPost', payload });
      }

      postResolvers.current.delete(payload.id);
    });
  }, [extension]);

  const post = useCallback<WalletState['post']>(
    (data) => {
      return new Promise((...resolver) => {
        const id = extension.post({
          ...(data as any),
          purgeQueue: true,
        });

        postResolvers.current.set(id, resolver);

        //extension.once('onPost', ({ error, ...payload }) => {
        //  console.log('ChromeExtensionWalletProvider.tsx..()', {
        //    error,
        //    ...payload,
        //  });
        //  if (error && 'code' in error && error.code === 1) {
        //    reject(new UserDeniedError());
        //  } else {
        //    resolve({ name: 'onPost', payload });
        //  }
        //});
      });
      //return extension.request('post', data) as any;
    },
    [extension],
  );

  useEffect(() => {
    if (isChrome) {
      checkStatus(true);
    }
  }, [checkStatus, isChrome]);

  useEffect(() => {
    // TODO disable process.env.NODE !== development
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
