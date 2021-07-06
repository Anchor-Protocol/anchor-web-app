export interface RouteMenu {
  to: string;
  exact?: boolean;
  title: string;
  doc: string;
}

export const menus: RouteMenu[] = [
  {
    to: '/',
    exact: true,
    title: 'DASHBOARD',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/earn',
  },
  {
    to: `/mypage`,
    title: 'MYPAGE',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/earn',
  },
  {
    to: '/earn',
    title: 'EARN',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/earn',
  },
  {
    to: '/borrow',
    title: 'BORROW',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/borrow',
  },
  {
    to: '/bond',
    title: 'BOND',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/bond',
  },
  {
    to: `/gov`,
    title: 'GOVERN',
    doc: 'https://docs.anchorprotocol.com/user-guide/webapp/govern',
  },
];
