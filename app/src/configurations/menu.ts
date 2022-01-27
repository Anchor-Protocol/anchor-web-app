export interface RouteMenu {
  to: string;
  exact?: boolean;
  title: string;
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
];
