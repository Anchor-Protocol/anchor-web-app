import { useInterval } from '@terra-dev/use-interval';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { WalletContext } from './useWallet';

const interval = 1000 * 60;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { recheckExtensionStatus } = useContext(WalletContext);

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    recheckExtensionStatus();
    lastCheckTime.current = Date.now();
  }, [recheckExtensionStatus]);

  useEffect(() => {
    check();
  }, [check, pathname]);

  const tick = useCallback(() => {
    const now = Date.now();

    if (now > lastCheckTime.current + interval) {
      check();
    }
  }, [check]);

  useInterval(tick, interval);
}

export function RouterWalletStatusRecheck() {
  useRouterWalletStatusRecheck();
  return null;
}
