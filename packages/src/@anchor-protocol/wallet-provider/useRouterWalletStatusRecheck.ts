import { useInterval } from '@terra-dev/use-interval';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from './useWallet';

const interval = 1000 * 10;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { checkStatus, inTransactionProgress } = useWallet();

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    console.log(
      'useRouterWalletStatusRecheck.ts..() check!!!',
      inTransactionProgress.current,
    );

    if (!inTransactionProgress.current) {
      checkStatus();
      lastCheckTime.current = Date.now();
    }
  }, [checkStatus, inTransactionProgress]);

  useEffect(() => {
    check();
  }, [check, inTransactionProgress, pathname]);

  const tick = useCallback(() => {
    const now = Date.now();

    console.log('useRouterWalletStatusRecheck.ts..() ???');

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
