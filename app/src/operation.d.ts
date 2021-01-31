declare module '@anchor-protocol/broadcastable-operation/global' {
  import { AddressProvider } from '@anchor-protocol/anchor.js/address-provider';
  import { WalletState } from '@anchor-protocol/wallet-provider';
  import { ApolloClient } from '@apollo/client';

  interface GlobalDependency {
    addressProvider: AddressProvider;
    client: ApolloClient<any>;
    post: WalletState['post'];
  }
}
