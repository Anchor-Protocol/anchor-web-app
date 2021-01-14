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

export const safeRatio = 0.7;

export const fixedGasUUSD = 3500000;

export const transactionFee = {
  //gasPrices: '0.0015uusd',
  //fee: new StdFee(503333, '5000000000000uusd'),
  fee: new StdFee(6000000, fixedGasUUSD + 'uusd'),
  gasAdjustment: 1.4,
};

/**
 * @deprecated will remove
 */
export const contractAddresses = {
  bLunaHub: 'terra1kvptfs0ajnngxtz32dlt2utqg7fcuxuzv4w76n',
  bAssetToken: 'terra12vxmfgkwk9e3qa2ckyfltqud8qfem2q3amsw3h',
  bAssetReward: 'terra182wkzv7hzx5wxhau3gh6rkqmzx7eek6uhmjsn0',
  mmInterest: 'terra1794fjrla8g0s42rvtjw4r52yqs2ef943m4zxcq',
  mmOracle: 'terra1uus0w8wqhx8gcwxtly2d49d5w87aaqu79jmstu',
  mmMarket: 'terra1jfy5843ct9qf34h36su5qajtn7m9pa3l99rtvd',
  mmOverseer: 'terra1ujjhrmxhk9clvlcslmzfdrr7hqfwwxadpjsmdw',
  mmCustody: 'terra1pxgnruc3xt5ncpvsjlz8ckkqgjxd3n5xjcsvga',
  mmLiquidation: 'terra1646hpgqurgxecgguq6szty8jsahy6nrd7z04jl',
  anchorToken: 'terra1y02q4j9dwuh448n5u954ku9yk2lrfeuwmcqstw',
  terraswapFactory: 'terra1cnzqa8m6lq48242dks6zujz2z5sqtg9jcmynpl',
  terraswapPair: 'unused',
};
