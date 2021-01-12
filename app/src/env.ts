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
  bLunaHub: 'terra1xhurqlwzfckncqkmgc7q864lytm6vynshfjel0',
  bAssetToken: 'terra1ny767tknhj2cmz6uauc4ydcpdy647h925cxp7h',
  bAssetReward: 'terra1ml2ryxrfxqf9ht7cfqywsrpq88f9dafr3p4yxl',
  mmInterest: 'terra1gvf9k5tp9j2gdpdh5wems638x6trfvmcmytldp',
  mmOracle: 'terra1czxwjwhv82mjch3sxhrm0rh2nczc4r9292sdx3',
  mmMarket: 'terra1cg4nk8ze6mkqpqfh8z7k97dh6846zhhkv0sk94',
  mmOverseer: 'terra1gm0d75qy6cdqke05ey29kynrcx0y2ezan2dru2',
  mmCustody: 'terra1sspa69cw65ddx43npsng5fvrjq3q64urja3949',
  mmLiquidation: 'terra1radgylfw9c8353dclxy8wckgekc5gsz48ndfl8',
  anchorToken: 'terra1gdak9jc2chn6kql7tkuedyh689wt0nzsljm0ku',
  terraswapFactory: 'terra10r7j8lkgpy89h8r8ydk0jzhrzn82jlfpgkdq7u',
  terraswapPair: 'unused',
};
