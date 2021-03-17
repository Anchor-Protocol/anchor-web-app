import { useInterval } from '@terra-dev/use-interval';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from './useWallet';

const interval = 1000 * 30;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { checkStatus } = useWallet();

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    checkStatus();
    lastCheckTime.current = Date.now();
  }, [checkStatus]);

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
