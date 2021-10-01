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
  token: process.env.VITE_CLOUD_FLARE_TOKEN,
  hostnames: [
    'app.anchorprotocol.com',
    'app.anchor.money',
    'app.anchor.finance',
  ],
};

export const GA_TRACKING_ID = process.env.VITE_GA_TRACKING_ID;

export const SENTRY_DSN = process.env.VITE_SENTRY_DSN;

// ---------------------------------------------
// chain
// ---------------------------------------------
export const onProduction =
  global.location.host === 'app.anchorprotocol.com' ||
  global.location.host === 'app.anchor.money' ||
  global.location.host === 'app.anchor.market' ||
  global.location.host === 'anchorprotocol.com' ||
  global.location.host === 'anchor.money' ||
  global.location.host === 'anchor.market';

//export const columbusContractAddresses: ExpandAddressMap =
//  DEFAULT_ADDESS_MAP['mainnet'];
//export const tequilaContractAddresses: ExpandAddressMap =
//  DEFAULT_ADDESS_MAP['testnet'];
//export const bombayContractAddresses: ExpandAddressMap =
//  DEFAULT_ADDESS_MAP['bombay'];
//
//export const ADDRESS_PROVIDERS = {
//  mainnet: new AddressProviderFromJson(columbusContractAddresses),
//  testnet: new AddressProviderFromJson(tequilaContractAddresses),
//  bombay: new AddressProviderFromJson(bombayContractAddresses),
//};
//
//export const ADDRESSES = {
//  mainnet: createAnchorContractAddress(
//    ADDRESS_PROVIDERS.mainnet,
//    columbusContractAddresses,
//  ),
//  testnet: createAnchorContractAddress(
//    ADDRESS_PROVIDERS.testnet,
//    tequilaContractAddresses,
//  ),
//  bombay: createAnchorContractAddress(
//    ADDRESS_PROVIDERS.bombay,
//    bombayContractAddresses,
//  ),
//};

// build: vercel trigger build - 21.10.01-1
