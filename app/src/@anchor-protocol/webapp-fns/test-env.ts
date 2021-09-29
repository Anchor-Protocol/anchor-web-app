import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress, HumanAddr } from '@anchor-protocol/types';
import { DEFAULT_ADDESS_MAP } from './env';
import { createAnchorContractAddress } from './functions/createAnchorContractAddress';

export const TEST_ADDRESS_MAP = DEFAULT_ADDESS_MAP({
  name: 'testnet',
  chainID: 'tequila-004',
  lcd: 'https://tequila-lcd.terra.dev',
});

export const TEST_ADDRESS_PROVIDER: AddressProvider =
  new AddressProviderFromJson(TEST_ADDRESS_MAP);

export const TEST_ADDRESSES: ContractAddress = createAnchorContractAddress(
  TEST_ADDRESS_PROVIDER,
  TEST_ADDRESS_MAP,
);

export const TEST_MANTLE_ENDPOINT = 'https://tequila-mantle.anchorprotocol.com';

export const TEST_WALLET_ADDRESS =
  'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr;
