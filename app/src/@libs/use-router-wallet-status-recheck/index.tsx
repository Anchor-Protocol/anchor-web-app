import { useInterval } from '@libs/use-interval';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { WalletContext } from '@terra-money/wallet-provider';

const interval = 1000 * 60;

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { recheckStatus } = useContext(WalletContext);

  const lastCheckTime = useRef<number>(Date.now());

  const check = useCallback(() => {
    recheckStatus();
    lastCheckTime.current = Date.now();
  }, [recheckStatus]);

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
