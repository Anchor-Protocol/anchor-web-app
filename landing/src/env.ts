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

export const links = {
  developers: 'https://docs.anchorprotocol.com/developers-earn/anchor-earn-sdk',
  app: 'https://app.anchorprotocol.com',
  betterYield: 'https://docs.anchorprotocol.com/protocol/overview',
  easierIntegration:
    'https://docs.anchorprotocol.com/developers-earn/anchor-earn-sdk',
  frictionlessAccess: 'https://app.anchorprotocol.com',
  contact: 'mailto:info@anchorprotocol.com',
  whitepaper: 'https://anchorprotocol.com/docs/anchor-v1.1.pdf',
  discord: 'https://discord.gg/9aUYgpKZ9c',
  forum: 'https://forum.anchorprotocol.com/',
  terra: 'https://terra.money/',
};

// force build : 21.08.24
