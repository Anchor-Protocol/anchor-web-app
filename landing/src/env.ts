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

export const landingMobileLayout = 680;

export const headerHeight = 84;

//export const FINDER = 'https://finder.terra.money';

//1st page top right (DEVELOPERS) -> https://docs.anchorprotocol.com/developers-terra/anchor.js
//2nd page Anchor Offers Better Yield -> https://docs.anchorprotocol.com/protocol/overview
//3rd page Anchor offers Easier Integrations -> https://docs.anchorprotocol.com/developers-terra/anchor.js
//4th page Anchor offers frictionless access -> https://app.anchorprotocol.com

export const links = {
  developers: 'https://docs.anchorprotocol.com/developers-terra/anchor.js',
  betterYield: 'https://docs.anchorprotocol.com/protocol/overview',
  easierIntegration:
    'https://docs.anchorprotocol.com/developers-terra/anchor.js',
  frictionlessAccess: 'https://app.anchorprotocol.com',
};
