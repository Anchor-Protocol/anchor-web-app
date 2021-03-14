import { onProduction } from 'base/env';

export const screen = {
  mobile: { max: 510 },
  // mobile : @media (max-width: ${screen.mobile.max}px)
  tablet: { min: 511, max: 830 },
  // tablet : @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet.max}px)
  pc: { min: 831, max: 1439 },
  // pc : @media (min-width: ${screen.pc.min}px)
  monitor: { min: 1440 },
  // monitor : @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px)
  // huge monitor : @media (min-width: ${screen.monitor.min}px)
} as const;

//EARN docs -> https://docs.anchorprotocol.com/user-guide/earn
//BORROW docs -> https://docs.anchorprotocol.com/user-guide/borrow
//BOND docs -> https://docs.anchorprotocol.com/user-guide/bond
//GOVERN docs -> https://docs.anchorprotocol.com/user-guide/govern

export const links = {
  earn: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/earn'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/earn',
  borrow: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/borrow'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/borrow',
  bond: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/bond'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/bond',
  gov: onProduction
    ? 'https://docs.anchorprotocol.com/user-guide/govern'
    : 'https://app.gitbook.com/@anchor-protocol/s/anchor-2/user-guide/govern',
  forum: 'https://forum.anchorprotocol.com/',
};
