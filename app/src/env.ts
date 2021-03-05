import { AddressMap } from '@anchor-protocol/anchor.js';
import type { Rate } from '@anchor-protocol/types';

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

export const GA_TRACKING_ID = 'G-H42LRVHR5Y';

export const SENTRY_DSN =
  'https://f33dd06d6f5948bfb06d809d0d0a274c@o247107.ingest.sentry.io/5636828';

export const SAFE_RATIO: Rate<number> = 0.7 as Rate<number>;

export const onProduction =
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market';

export const defaultNetwork = onProduction
  ? {
      chainID: 'columbus-4',
      fcd: 'https://fcd.terra.dev',
      lcd: 'https://lcd.terra.dev',
      name: 'mainnet',
      ws: 'wss://fcd.terra.dev',
    }
  : {
      chainID: 'tequila-0004',
      fcd: 'https://tequila-fcd.terra.dev',
      lcd: 'https://tequila-lcd.terra.dev',
      name: 'testnet',
      ws: 'wss://tequila-ws.terra.dev',
    };

/**
 * @deprecated will remove
 */
export const contractAddresses: AddressMap = {
  bLunaHub: 'terra1zdu9ph3429dtstv57ve3sfzr2vz2fclvmhn6td',
  blunaToken: 'terra1wq9f8p8f7gldztpdc4v3awngupfkap8wpxhtjr',
  blunaReward: 'terra16rjk255rjc6vt2qg7h8ntfdykrzfkt0e5wykus',
  blunaAirdrop: 'terra1093jc6g8gcuxp0vvfuzkk26rvnz38du886c88m',
  mmInterestModel: 'terra1rrutuqshjkgfh22n5eau8jac0vn4hsyhcz3ju2',
  mmOracle: 'terra1rz5chzn0g07hp5jx63srpkhv8hd7x8pss20w2e',
  mmMarket: 'terra1shmnertem9ujjxys2vxy2x92h0jzhctkjdv956',
  mmOverseer: 'terra174dcdqlkdwvsxqpkt47f9cy3anlv56ge5c05ex',
  mmCustody: 'terra1urn8z5uqukjzr8sqdjdryj6nt5v3qttfta2zwn',
  mmLiquidation: 'terra1sm76ssl55vnwnu96d00t8jl8pzwg5nvm02m5k7',
  mmDistributionModel: 'terra1ajawq49hutlsytxstys2x58464dy06rlzphmvy',
  aTerra: 'terra1xhxx7tgth24d8f9pz6vkjmvulp88xh9vl9kmxu',
  terraswapblunaLunaPair: 'terra1ykeemrj3nj6jlx5jxatmxkmjg894q3ftwnxn6k',
  terraswapblunaLunaLPToken: 'terra1uhf9u4a6vtkvnwn4cw6hmzaxm5zzzn6ukmjq2g',
  terraswapAncUstPair: 'terra10lkkzutjesqpphugfuzdzy5995u37tmc72a255',
  terraswapAncUstLPToken: 'terra1usrmk383nc6vjqq9sahkaca0p9k6cu0arvys43',
  gov: 'terra1dakqt3s8dywea9advxz4duxkuvglz3a34yczw9',
  //distributor: 'terra1ytyge2vqtl9kcj8amrx9pxjypmw00244e7l3ye',
  collector: 'terra1hz6wk7psk5d0sh3u3vwtjrawvrk8hkt6vgnemm',
  community: 'terra15l0pep3ww9k4aa50jmf2dnj68ak9tc2s30m2d3',
  staking: 'terra1tcmhs005clcakqtquk58j3s5z0gkjm4c7wkzhu',
  ANC: 'terra1800p00qlxh0nmt0r0u9hv7m4lg042fnafng2t6',
  airdrop: 'terra18vlmtqhxgdp49vsfsk6pwvye8rg33nc2x92alr',

  faucet: '',
  terraswapFactory: '',
};
