import { Ratio } from '@anchor-protocol/notation';

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

//export const FINDER = 'https://finder.terra.money';

export const SAFE_RATIO: Ratio<number> = 0.7 as Ratio<number>;

//export const FIXED_GAS: uUST<number> = 3500000 as uUST<number>;
////export const FIXED_GAS: uUST<number> = 35000 as uUST<number>; // when need to occur transaction failed
//
//export const GAS_FEE = 6000000 as uUST<number>;
//
//export const TRANSACTION_FEE = {
//  //gasPrices: '0.0015uusd',
//  //fee: new StdFee(503333, '5000000000000uusd'),
//  fee: new StdFee(GAS_FEE, FIXED_GAS + 'uusd'),
//  gasAdjustment: 1.4,
//};

//export const BLOCKS_PER_YEAR = 5256666;

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
  bLunaHub: 'terra1kzx23xs8v9yggf6lqpwgerg455e8xzsv0s0glf',
  bAssetToken: 'terra12kz7ehjh9m2aexmyumlt29qjuc9j5mjcdp0d5k',
  bAssetReward: 'terra1pjpzktukkd20amfwc0d8mahjg5na2pgu3swdu4',
  mmInterest: 'terra16f3lv77yu4ga4w8m7jl0xg2xkavqe347dz30v9',
  mmOracle: 'terra1enud48d754pau5rce79xsdx9gfschw2eelwcuj',
  mmMarket: 'terra1r8vmgf3mf5m5gcp09fnj2ewsyaqppr6ke50mf2',
  mmOverseer: 'terra1t6zjqmqjvsfrszr65cppug4gd4xkqm33vugwl2',
  mmCustody: 'terra1usycpap7j0mz4ynrgmtv7jc7uwqka345ushknz',
  mmLiquidation: 'terra14pdcpx6szzfvhz4g6dfddkx82f5ssf8llmzpw4',
  anchorToken: 'terra10c0q6qyk2634tfx2nw9v4gxqlm7a0luk9huhy8',
  terraswapFactory: 'terra1mtvsarza55hehpmyjgw7edqwvxpq5qquvttz9n',
  blunaBurnPair: 'terra1w6qcjvcwe8ljafp2859kmmcfern35ap9sngm3q',
  blunaBurnuluna: 'terra12y3emkv22ug94wnq5zpmhws6fgtr929rtaq6je',
};
