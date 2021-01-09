import { AddressProviderFromJson } from '@anchor-protocol/anchor-js/address-provider';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { contractAddresses } from 'env';

export const testClient = new ApolloClient({
  uri: 'https://tequila-mantle.terra.dev',
  cache: new InMemoryCache(),
});

export const testAddressProvider = new AddressProviderFromJson(
  contractAddresses,
);

export const testWalletAddress = 'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v';
