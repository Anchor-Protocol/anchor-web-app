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
export const contractAddresses = {
  bLunaHub: 'terra1qpeapgucdd9v3dns8j60um94r5rnegyp8fp9rr',
  blunaToken: 'terra1pm4d64dlngwuxh8a2rmkx56lrgq795vx4g0u9g',
  blunaReward: 'terra12zznxh59l8e2fl8duf2agxyngvv4vayh523l0j',
  blunaAirdrop: 'terra1rm65wy7k9j669lux7n7s95ndhkn2rpv59hztpg',
  mmInterestModel: 'terra1m07nch4hrgr9r9xapuv7z7qn2cgc4tugy44hzp',
  mmOracle: 'terra13lkhqjazfe3dn7vrjmsxrm94mgwpkd5atst3an',
  mmMarket: 'terra1zg2myu6x9ryeyqm86zhvmn9gt7ykqgtzp94zjw',
  mmOverseer: 'terra1evqupf62q8usks968pn3kqfs37lh9e4ct8l3r4',
  mmCustody: 'terra1qf37lcxvj43m03fadkhl0j0dt3qm328f64m4au',
  mmLiquidation: 'terra17mvw0a8pkwzljzqfnpgc04w58uu2t0m5alejax',
  mmdistributionModel: 'terra1qhducr784hs5dwy2aqf87m44qu2cq8uwa5dy99',
  aTerra: 'terra1mj2p7r4886ljadtelvmphqj946nv34ks2jdeyz',
  terraswapFactory: 'terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf',
  terraswapblunaLunaPair: 'terra1alzpqevx3hg5lyf6925k902wyq6q4w068w7avt',
  terraswapblunaLunaLPToken: 'terra1u3g737cx5tyuwpmf8gxnn4dymxlaq74rzxjg4u',
  terraswapAncUstPair: 'terra1pks49j0lqeae874cjn32wpvwdz4nkv6vx767r4',
  terraswapAncUstLPToken: 'terra1m9lf50qxajujllyacuwmy3c28kk6fjayezvn96',
  gov: 'terra1grjkq4ke45rmd4gktjmpajv8rg3rnes9mzs8gs',
  faucet: 'terra19mk5g0ngudpkmuhyh2qdgz5c3jehvpu43p4x5f',
  collector: 'terra1h6e8ythcvdqqz9jx5snylu3k9ynnuuy52sa6xk',
  community: 'terra1qds4gm6tplrhdumm0sm3h3leqxdrdruzq4aekh',
  staking: 'terra1hjk5vur4kj0p7prxmn463zq3e9qe8a9q8d0x3m',
  ANC: 'terra1qfrasf2ajaynut6qlfdrgts4dwp854e5ess2gd',
  airdrop: 'terra130eefc9dnffl5ussg5afz7mkq4hw7tv2wqsqes',
};
