import { AddressProviderFromJson } from '@anchor-protocol/anchor.js/address-provider';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { contractAddresses } from 'env';

export const testClient = new ApolloClient({
  uri: 'https://tequila-mantle.terra.dev',
  cache: new InMemoryCache(),
});

export const testAddressProvider = new AddressProviderFromJson(
  contractAddresses,
);

export const testWalletAddress = 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9';
