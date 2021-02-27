import {
  AddressProvider,
  AddressProviderFromJson,
} from '@anchor-protocol/anchor.js';
import { ContractAddress, HumanAddr } from '@anchor-protocol/types';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createContractAddress } from 'contexts/contract';
import { contractAddresses } from 'env';

export const testClient = new ApolloClient({
  uri: 'https://tequila-mantle.anchorprotocol.com',
  //uri: 'https://tequila-mantle.terra.dev',
  cache: new InMemoryCache(),
});

/** @deprecated */
export const testAddressProvider: AddressProvider = new AddressProviderFromJson(
  contractAddresses,
);

export const testAddress: ContractAddress = createContractAddress(
  testAddressProvider,
);

export const testWalletAddress: HumanAddr = 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr;
