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
  earn: 'https://docs.anchorprotocol.com/user-guide/earn',
  borrow: 'https://docs.anchorprotocol.com/user-guide/borrow',
  bond: 'https://docs.anchorprotocol.com/user-guide/bond',
  gov: 'https://docs.anchorprotocol.com/user-guide/govern',
};
