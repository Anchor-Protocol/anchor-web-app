import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { HumanAddr } from '@anchor-protocol/types';
import { AnchorContractAddress } from '@anchor-protocol/webapp-provider';
import { DEFAULT_ADDESS_MAP } from './env';
import { createAnchorContractAddress } from './functions/createAnchorContractAddress';

export const TEST_ADDRESS_MAP = DEFAULT_ADDESS_MAP({
  name: 'testnet',
  chainID: 'bombay-12',
  lcd: 'https://bombay-lcd.terra.dev',
});

export const TEST_ADDRESS_PROVIDER: AddressProvider =
  new AddressProviderFromJson(TEST_ADDRESS_MAP);

export const TEST_ADDRESSES: AnchorContractAddress =
  createAnchorContractAddress(TEST_ADDRESS_PROVIDER, TEST_ADDRESS_MAP);

export const TEST_MANTLE_ENDPOINT = 'https://bombay-mantle.terra.dev';

export const TEST_WALLET_ADDRESS =
  'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr;
