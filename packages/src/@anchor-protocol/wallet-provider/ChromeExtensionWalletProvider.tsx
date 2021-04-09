import type { HumanAddr } from '@anchor-protocol/types/contracts';
import { AccAddress } from '@terra-money/terra.js';
import { createExtension } from '@terra-money/terra.js.extension';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { extensionFixer, FixedExtension } from './extensionFixer';
import { intervalCheck } from './internal/intervalCheck';
import { StationNetworkInfo, WalletStatus, WalletStatusType } from './types';
import { WalletContext, WalletProviderProps, WalletState } from './useWallet';

const storage = localStorage;

const WALLET_ADDRESS: string = '__anchor_terra_station_wallet_address__';
const STORED_WALLET_ADDRESS: string = '__anchor_stored_wallet_address__';

const initialStoredWalletAddress = localStorage.getItem(STORED_WALLET_ADDRESS);

export function ChromeExtensionWalletProvider({
  children,
  defaultNetwork,
  enableWatchConnection = true,
}: WalletProviderProps) {
  const isDesktopChrome = true; //useIsDesktopChrome();

  const inTransactionProgress = useRef<boolean>(false);

  const extension = useRef<FixedExtension>();

  useEffect(() => {
    createExtension().then((rawExtension) => {
      extension.current = extensionFixer(rawExtension, inTransactionProgress);
    });
  }, []);

  //const extension = useMemo(() => {
  //  const extension = createExtension();
  //  return extensionFixer(extension, inTransactionProgress);
  //}, []);

  const storedWalletAddress = useRef<HumanAddr | undefined>(
    initialStoredWalletAddress
      ? (initialStoredWalletAddress as HumanAddr)
      : undefined,
  );

  const [status, setStatus] = useState<WalletStatus>(() => {
    if (storedWalletAddress.current) {
      return {
        status: WalletStatusType.WALLET_ADDRESS_CONNECTED,
        network: defaultNetwork,
        walletAddress: storedWalletAddress.current,
      };
    }

    return {
      status: isDesktopChrome
        ? WalletStatusType.INITIALIZING
        : WalletStatusType.UNAVAILABLE,
      network: defaultNetwork,
    };
  });

  const watchConnection = useRef<boolean>(enableWatchConnection);

  const firstCheck = useRef<boolean>(false);

  const checkStatus = useCallback(
    async (watingExtensionScriptInjection: boolean = false) => {
      // if there is providedAddress and the browser is not the Chrome
      // network is defaultNetwork
      if (storedWalletAddress.current && !isDesktopChrome) {
        setStatus((prev) => {
          return storedWalletAddress.current &&
            (prev.status !== WalletStatusType.WALLET_ADDRESS_CONNECTED ||
              prev.walletAddress !== storedWalletAddress.current)
            ? {
                status: WalletStatusType.WALLET_ADDRESS_CONNECTED,
                walletAddress: storedWalletAddress.current,
                network: defaultNetwork,
              }
            : prev;
        });
        return;
      }

      // if there is no providedAddress and the browser is not the Chrome
      // does not need check more
      if (!isDesktopChrome) {
        return;
      }

      // if the check is not first check and first check is not completed
      // does not need check more
      if (!watingExtensionScriptInjection && !firstCheck.current) {
        return;
      }

      // ---------------------------------------------
      // check available use chrome extension
      // ---------------------------------------------
      const isExtensionInstalled = watingExtensionScriptInjection
        ? await intervalCheck(
            20,
            () => extension.current?.isAvailable() ?? false,
          )
        : extension.current?.isAvailable();

      firstCheck.current = true;

      if (!extension.current) return;

      // if extension is not installed
      // does not need check more
      if (!isExtensionInstalled) {
        setStatus((prev) => {
          if (storedWalletAddress.current) {
            return prev.status !== WalletStatusType.WALLET_ADDRESS_CONNECTED ||
              prev.walletAddress !== storedWalletAddress.current
              ? {
                  status: WalletStatusType.WALLET_ADDRESS_CONNECTED,
                  walletAddress: storedWalletAddress.current,
                  network: defaultNetwork,
                }
              : prev;
          }

          return prev.status !== WalletStatusType.NOT_INSTALLED
            ? {
                status: WalletStatusType.NOT_INSTALLED,
                network: defaultNetwork,
              }
            : prev;
        });
        return;
      }

      // ---------------------------------------------
      // get wallet network info
      // ---------------------------------------------
      const infoPayload = await extension.current.info();

      const network: StationNetworkInfo = (infoPayload ??
        defaultNetwork) as any;

      if (storedWalletAddress.current) {
        setStatus((prev) => {
          return storedWalletAddress.current &&
            (prev.status !== WalletStatusType.WALLET_ADDRESS_CONNECTED ||
              prev.walletAddress !== storedWalletAddress.current ||
              prev.network.chainID !== network.chainID)
            ? {
                status: WalletStatusType.WALLET_ADDRESS_CONNECTED,
                walletAddress: storedWalletAddress.current,
                network,
              }
            : prev;
        });
      } else if (watchConnection.current) {
        const storedWalletAddress: string | null = storage.getItem(
          WALLET_ADDRESS,
        );

        if (storedWalletAddress && AccAddress.validate(storedWalletAddress)) {
          const connectResult = await extension.current.connect();

          if (
            connectResult?.address &&
            AccAddress.validate(connectResult.address) &&
            connectResult.address !== storedWalletAddress
          ) {
            storage.setItem(WALLET_ADDRESS, connectResult.address);
          }

          setStatus((prev) => {
            return prev.status !== WalletStatusType.CONNECTED ||
              prev.walletAddress !== connectResult.address
              ? {
                  status: WalletStatusType.CONNECTED,
                  network,
                  walletAddress: connectResult.address as HumanAddr,
                }
              : prev;
          });
        } else {
          if (storedWalletAddress) {
            storage.removeItem(WALLET_ADDRESS);
          }

          setStatus((prev) => {
            return prev.status !== WalletStatusType.NOT_CONNECTED
              ? { status: WalletStatusType.NOT_CONNECTED, network }
              : prev;
          });
        }
      } else {
        setStatus((prev) => {
          return prev.status !== WalletStatusType.NOT_CONNECTED
            ? { status: WalletStatusType.NOT_CONNECTED, network }
            : prev;
        });
      }
    },
    [defaultNetwork, isDesktopChrome],
  );

  const install = useCallback(() => {
    window.open(
      'https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp',
      '_blank',
    );
  }, []);

  const connect = useCallback(async () => {
    const result = await extension.current?.connect();

    if (result?.address) {
      const walletAddress: string = result.address;
      storage.setItem(WALLET_ADDRESS, walletAddress);

      await checkStatus();
    }
  }, [checkStatus]);

  const disconnect = useCallback(() => {
    storedWalletAddress.current = undefined;
    storage.removeItem(STORED_WALLET_ADDRESS);

    storage.removeItem(WALLET_ADDRESS);

    checkStatus();
  }, [checkStatus]);

  const post = useCallback<WalletState['post']>((data) => {
    if (!extension.current) {
      throw new Error(`do not post before extension initialized`);
    }
    return extension.current.post(data);
  }, []);

  const provideAddress = useCallback(
    (address: HumanAddr) => {
      storedWalletAddress.current = address;
      storage.setItem(STORED_WALLET_ADDRESS, address);

      storage.removeItem(WALLET_ADDRESS);

      checkStatus();
    },
    [checkStatus],
  );

  useEffect(() => {
    if (isDesktopChrome) {
      setTimeout(() => {
        checkStatus(true);
      });
    }
  }, [checkStatus, isDesktopChrome]);

  const state = useMemo<WalletState>(
    () => ({
      status,
      install,
      connect,
      disconnect,
      connectWalletAddress: provideAddress,
      post,
      checkStatus,
      inTransactionProgress,
    }),
    [checkStatus, connect, disconnect, install, post, provideAddress, status],
  );

  return (
    <WalletContext.Provider value={state}>
      {typeof children === 'function' ? children(state) : children}
    </WalletContext.Provider>
  );
}
