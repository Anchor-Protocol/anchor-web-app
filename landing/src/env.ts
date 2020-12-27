export const screen = {
  mobile: {max: 510},
  // mobile : @media (max-width: ${screen.mobile.max}px)
  tablet: {min: 511, max: 830},
  // tablet : @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet.max}px)
  pc: {min: 831, max: 1439},
  // pc : @media (min-width: ${screen.pc.min}px)
  monitor: {min: 1440},
  // monitor : @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px)
  // huge monitor : @media (min-width: ${screen.monitor.min}px)
} as const;

export const FINDER = 'https://finder.terra.money';