import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWallet } from './useWallet';

export function useRouterWalletStatusRecheck() {
  const { pathname } = useLocation();
  const { checkStatus } = useWallet();

  useEffect(() => {
    checkStatus();
  }, [checkStatus, pathname]);
}

export function RouterWalletStatusRecheck() {
  useRouterWalletStatusRecheck();

  return null;
}
