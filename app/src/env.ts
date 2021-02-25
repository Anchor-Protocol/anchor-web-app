import { AddressProviderJsonData } from '@anchor-protocol/anchor-js/address-provider';
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

export const GA_TRACKING_ID = 'G-H42LRVHR5Y';

export const SENTRY_DSN =
  'https://f33dd06d6f5948bfb06d809d0d0a274c@o247107.ingest.sentry.io/5636828';

export const SAFE_RATIO: Ratio<number> = 0.7 as Ratio<number>;

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
export const contractAddresses: AddressProviderJsonData = {
  bLunaHub: 'terra1eve4z3vwa072z62n5r4hh8wfy2927dxxfja8lf',
  bAssetToken: 'terra1j50pr8we753a6f60c8kj7x5hyasfq3ywcclq24',
  bAssetReward: 'terra1all8dp67y8k7087kph66jjqsvc2aj7xvee9460',
  bAssetAirdrop: 'terra1lfsmka506587esrl7kea8w4cf20ul0cjak4qgw',
  mmInterest: 'terra1dh7zuw8d96rkvjmf0yfn74g2cqr70r2app6wqv',
  mmOracle: 'terra10w3vr3ze7pchg93qcay48e9jgz0yg0m2skp36h',
  mmMarket: 'terra1echmvg8ntu3sgf6smmcx84xa9930tlfhvy2ddl',
  mmOverseer: 'terra19xxt4cvlrjeg3yzxzxwjs5wycysyxd4h3g0uj7',
  mmCustody: 'terra1dxtrqypwaky89p60rey3f5hdtw87ytngvtm8n3',
  mmLiquidation: 'terra18swt222urd6dfga4fjruy5gr8pdqcjkmxr3xqq',
  mmdistribution: 'terra1hcgudjd2293d78g97xqsfapqqseuvvals9h89l',
  anchorToken: 'terra153xdrtsmn8wkhxgzms6ss6rm8klkpnz4xhxnrx',
  terraswapFactory: 'terra1ccvnhpr88c2hk7swsn2r3z08kec8ax8n3dsfkk',
  blunaBurnPair: 'terra1z7at4dsc4jgz4xtud36hrhxxttwn5yq89vrz6s',
  blunaBurnuluna: 'terra19t5rxwrw404w0vcnxhr3rjvdrmwlda4ana698n',
  blunaUlunaPair: 'terra1z7at4dsc4jgz4xtud36hrhxxttwn5yq89vrz6s',
  blunaUlunaToken: 'terra19t5rxwrw404w0vcnxhr3rjvdrmwlda4ana698n',
  anchorUusdPair: 'terra1p4cr772upacrsnfjljr08r5plq52q7kzh2wrep',
  anchorUusdToken: 'terra194y89equv242z5zydv9p0ulp47z9ts3s3s9mrm',
  gov: 'terra129aktkertazgw633sr22795zawvxcmlrfkvuvc',
  faucet: 'terra1d0zck6dh029lh5fmuraj2t03cz4fue8zkdaqt8',
  collector: 'terra1qf0mqcv2pgdm0ztdggy6me5rzzh7a6zypp9td4',
  community: 'terra1fslrcskr75ne7ruxm09edf937x3q4wvluree8q',
  staking: 'terra17rjwrakf8xdewnu8m0hqfwh4lcl6ajljhv5qq3',
  token: 'terra1sdvgy8fg76zley8kxautnhc2lhyaj62vkkfm6l',
  airdrop: 'terra1l6c83meglqnhs2xke7cyc7vrywn78h6dsfdp0x',
};

//  {
//  bLunaHub: 'terra1kzx23xs8v9yggf6lqpwgerg455e8xzsv0s0glf',
//  bAssetToken: 'terra12kz7ehjh9m2aexmyumlt29qjuc9j5mjcdp0d5k',
//  bAssetReward: 'terra1pjpzktukkd20amfwc0d8mahjg5na2pgu3swdu4',
//  mmInterest: 'terra16f3lv77yu4ga4w8m7jl0xg2xkavqe347dz30v9',
//  mmOracle: 'terra1enud48d754pau5rce79xsdx9gfschw2eelwcuj',
//  mmMarket: 'terra1r8vmgf3mf5m5gcp09fnj2ewsyaqppr6ke50mf2',
//  mmOverseer: 'terra1t6zjqmqjvsfrszr65cppug4gd4xkqm33vugwl2',
//  mmCustody: 'terra1usycpap7j0mz4ynrgmtv7jc7uwqka345ushknz',
//  mmLiquidation: 'terra14pdcpx6szzfvhz4g6dfddkx82f5ssf8llmzpw4',
//  anchorToken: 'terra10c0q6qyk2634tfx2nw9v4gxqlm7a0luk9huhy8',
//  terraswapFactory: 'terra1mtvsarza55hehpmyjgw7edqwvxpq5qquvttz9n',
//  blunaBurnPair: 'terra1w6qcjvcwe8ljafp2859kmmcfern35ap9sngm3q',
//  blunaBurnuluna: 'terra12y3emkv22ug94wnq5zpmhws6fgtr929rtaq6je',
//};
