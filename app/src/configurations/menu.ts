import { useDeploymentTarget, Chain } from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export interface RouteMenu {
  to: string;
  exact?: boolean;
  title: string;
}

const dashboard: RouteMenu = {
  to: '/',
  exact: true,
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

const bond: RouteMenu = {
  to: '/bond',
  title: 'BOND',
};

const govern: RouteMenu = {
  to: `/gov`,
  title: 'GOVERN',
};

const useMenus = (): RouteMenu[] => {
  const { chain } = useDeploymentTarget();
  return useMemo(() => {
    switch (chain) {
      case Chain.Terra:
        return [dashboard, myPage, earn, borrow, bond, govern];
      case Chain.Ethereum:
        //return [dashboard, myPage, earn, borrow];
        return [dashboard, myPage, earn];
    }
  }, [chain]);
};

export { useMenus };
