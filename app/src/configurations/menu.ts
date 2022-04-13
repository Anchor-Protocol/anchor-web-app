import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export interface RouteMenu {
  to: string;
  title: string;
}

const dashboard: RouteMenu = {
  to: '/',
  title: 'DASHBOARD',
};

const myPage: RouteMenu = {
  to: `/mypage`,
  title: 'MY PAGE',
};

const earn: RouteMenu = {
  to: '/earn',
  title: 'EARN',
};

const borrow: RouteMenu = {
  to: '/borrow',
  title: 'BORROW',
};

const bAsset: RouteMenu = {
  to: '/basset',
  title: 'bASSET',
};

const govern: RouteMenu = {
  to: `/gov`,
  title: 'GOVERN',
};

const hackathon: RouteMenu = {
  to: `/hackathon`,
  title: 'HACKATHON',
};

const useMenus = (): RouteMenu[] => {
  const {
    target: { isEVM },
  } = useDeploymentTarget();
  return useMemo(() => {
    if (isEVM) {
      return [dashboard, myPage, earn, borrow, govern, hackathon];
    }
    return [dashboard, myPage, earn, borrow, bAsset, govern, hackathon];
  }, [isEVM]);
};

export { useMenus };
