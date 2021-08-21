import { AddressProviderFromJson } from '@anchor-protocol/anchor.js';
import { Rate } from '@anchor-protocol/types';
import {
  createAnchorContractAddress,
  DEFAULT_ADDESS_MAP,
  ExpandAddressMap,
} from '@anchor-protocol/webapp-fns';

// ---------------------------------------------
// style
// ---------------------------------------------
export const screen = {
  mobile: { max: 530 },
  // mobile : @media (max-width: ${screen.mobile.max}px)
  tablet: { min: 531, max: 830 },
  // tablet : @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet.max}px)
  pc: { min: 831, max: 1439 },
  // pc : @media (min-width: ${screen.pc.min}px)
  monitor: { min: 1440 },
  // monitor : @media (min-width: ${screen.pc.min}px) and (max-width: ${screen.pc.max}px)
  // huge monitor : @media (min-width: ${screen.monitor.min}px)
} as const;

export const BODY_MARGIN_TOP = {
  pc: 50,
  mobile: 10,
  tablet: 20,
};

export const mobileHeaderHeight = 68;

// ---------------------------------------------
// links
// ---------------------------------------------
export const links = {
  forum: 'https://forum.anchorprotocol.com/',
  docs: {
    earn: 'https://docs.anchorprotocol.com/user-guide/webapp/earn',
    borrow: 'https://docs.anchorprotocol.com/user-guide/webapp/borrow',
    bond: 'https://docs.anchorprotocol.com/user-guide/webapp/bond',
    gov: 'https://docs.anchorprotocol.com/user-guide/webapp/govern',
  },
} as const;

// ---------------------------------------------
// environment
// ---------------------------------------------
export const cloudFlareOption = {
  token: '53059bc341e44118afa382ac686bd39e',
  hostnames: [
    'app.anchorprotocol.com',
    'app.anchor.money',
    'app.anchor.finance',
  ],
};

export const firebaseOptions = {
  apiKey: 'AIzaSyBWlk1KY16SFu7VES06h3wRcib20VE7X3M',
  authDomain: 'fcm-test-26055.firebaseapp.com',
  projectId: 'fcm-test-26055',
  storageBucket: 'fcm-test-26055.appspot.com',
  messagingSenderId: '823490469792',
  appId: '1:823490469792:web:9499ddd14486262c27cec5',
  measurementId: 'G-GRHXHP1YRM',
};

export const GA_TRACKING_ID = 'G-H42LRVHR5Y';

export const SENTRY_DSN =
  'https://f33dd06d6f5948bfb06d809d0d0a274c@o247107.ingest.sentry.io/5636828';

// ---------------------------------------------
// chain
// ---------------------------------------------
export const SAFE_RATIO: Rate<number> = 0.7 as Rate<number>;

export const onProduction =
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market' ||
  global.location.host === 'anchorprotocol.com' ||
  global.location.host === 'anchor.money' ||
  global.location.host === 'anchor.market';

export const columbusContractAddresses: ExpandAddressMap =
  DEFAULT_ADDESS_MAP['mainnet'];
export const tequilaContractAddresses: ExpandAddressMap =
  DEFAULT_ADDESS_MAP['testnet'];
export const bombayContractAddresses: ExpandAddressMap =
  DEFAULT_ADDESS_MAP['bombay'];

export const ADDRESS_PROVIDERS = {
  mainnet: new AddressProviderFromJson(columbusContractAddresses),
  testnet: new AddressProviderFromJson(tequilaContractAddresses),
  bombay: new AddressProviderFromJson(bombayContractAddresses),
};

export const ADDRESSES = {
  mainnet: createAnchorContractAddress(
    ADDRESS_PROVIDERS.mainnet,
    columbusContractAddresses,
  ),
  testnet: createAnchorContractAddress(
    ADDRESS_PROVIDERS.testnet,
    tequilaContractAddresses,
  ),
  bombay: createAnchorContractAddress(
    ADDRESS_PROVIDERS.bombay,
    bombayContractAddresses,
  ),
};

// build: vercel trigger build - 21.08.22
