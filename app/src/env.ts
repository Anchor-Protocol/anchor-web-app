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
  bLunaHub: 'terra1qxxlalvsdjd07p07y3rc5fu6ll8k4tme7cye8y',
  blunaToken: 'terra13nkgqrfymug724h8pprpexqj9h629sa3ncw7sh',
  blunaReward: 'terra174kgn5rtw4kf6f938wm7kwh70h2v4vcfd26jlc',
  blunaAirdrop: 'terra13aktep558cx6lny74c8st5qwt0jj66zgr7yz93',
  mmInterestModel: 'terra1t9ahse97a382wn6cjcyfaswjp0grrp503lcpd0',
  mmOracle: 'terra1pe72s6w69rdzrqyuu4eaf7sp8ushzf6w757gyf',
  mmMarket: 'terra1nvx0uchlhf3rf6qgrvvvy7zewm0ekqmuzealph',
  mmOverseer: 'terra1mer0n9pn2efavlnckpm5v03uw5mshds4my3j40',
  mmCustody: 'terra1h620t6t9s84ecrjspy5mnmw3z024z6xrvvqg7v',
  mmLiquidation: 'terra12vh2q53k06lemgwrp9ujzlzcrn02kj0hagthly',
  mmDistributionModel: 'terra19s2x7kzwekkky63eznsdy5ktghtsezkejks72d',
  aTerra: 'terra1059nz3h87g5t6sht44w7cyj2ekd72mrp6z2nv6',
  terraswapblunaLunaPair: 'terra1d5jrdj2weckkymjanfcw7y6wpjpuswesasp78y',
  terraswapblunaLunaLPToken: 'terra1ctsytwzuhvnjmpkw3zf2mh9fghjxjmfqjqmejf',
  terraswapAncUstPair: 'terra1uq0haxdf5cgg7s76frd3rtnr0trzaazyy00jqf',
  terraswapAncUstLPToken: 'terra18hqp4vw27zvuk5uxcezdw7jz9cgd96lwwng7dn',
  gov: 'terra1ne5x5kh9qu3d8hakmk2uj7nmyxck3g9klzjnay',
  //distributor: 'terra174u76knkvh9c9va2ktjlwus35jtmdsh6cjyxeu',
  collector: 'terra1am7gpv35q80c6x2w8vfg4kp9mnedujjj73g3dr',
  community: 'terra1lskyenrt4q658kgdlk8jkwg73ha3dnq60up6m6',
  staking: 'terra1sttn0k3w8jedz563z22khhajmy3juqtea0gfue',
  ANC: 'terra1x7ultkwvchhsppt46x79jvcdtuzdpcnc9r0rd2',
  airdrop: 'terra18ll2fw6q3h5qq9uuv8kt0za2hf6el5pv9v8qhm',

  faucet: '',
  terraswapFactory: '',
};
