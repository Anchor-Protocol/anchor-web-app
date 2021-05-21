import { onProduction } from 'base/env';

export const screen = {
  mobile: { max: 530 },
  // mobile : @media (max-width: ${screen.mobile.max}px)
  tablet: { min: 531, max: 830 },
  // tablet : @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet.max}px)
  pc: { min: 831, max: 1439 },
  // pc : @media (min-width: ${screen.pc.min}px)
  monitor: { min: 1440 },
  // monitor : @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px)
  // huge monitor : @media (min-width: ${screen.monitor.min}px)
} as const;

export const links = {
  earn: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/webapp/earn'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/earn',
  borrow: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/webapp/borrow'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/borrow',
  bond: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/webapp/bond'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/bond',
  gov: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/webapp/govern'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/govern',
  forum: 'https://forum.anchorprotocol.com/',
};

export const BODY_MARGIN_TOP = {
  pc: 50,
  mobile: 10,
  tablet: 20,
};

export const mobileHeaderHeight = 68;

export const cloudFlareOption = {
  token: '53059bc341e44118afa382ac686bd39e',
  hostnames: [
    'app.anchorprotocol.com',
    'app.anchor.money',
    'app.anchor.finance',
  ],
};

// build: vercel trigger build - 21.05.21
