export interface RouteMenu {
  to: string;
  title: string;
  exact?: boolean;
  highlighted?: boolean;
}

export const menus: RouteMenu[] = [
  {
    to: '/',
    exact: true,
    title: 'DASHBOARD',
  },
  {
    to: `/mypage`,
    title: 'MY PAGE',
  },
  {
    to: '/earn',
    title: 'EARN',
  },
  {
    to: '/borrow',
    title: 'BORROW',
  },
  {
    to: '/basset',
    title: 'bASSET',
  },
  {
    to: `/gov`,
    title: 'GOVERN',
  },
  {
    to: `/airdrop`,
    title: 'AIRDROPS',
  },
];
