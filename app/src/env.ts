import { ApolloClient, InMemoryCache } from '@apollo/client';
import { StdFee } from '@terra-money/terra.js';

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

export const FINDER = 'https://finder.terra.money';

/**
 * @deprecated it will create on checking wallet connection
 */
export const mantleClient = new ApolloClient({
  uri:
    process.env.REACT_APP_MANTLE_ENDPOINT ?? 'https://tequila-mantle.terra.dev',
  cache: new InMemoryCache(),
});

export const transactionFee = {
  //gasPrices: '0.0015uusd',
  //fee: new StdFee(503333, '5000000000000uusd'),
  fee: new StdFee(6000000, '2000000uusd'),
  gasAdjustment: 1.4,
};