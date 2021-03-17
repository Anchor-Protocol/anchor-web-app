declare module '@terra-dev/broadcastable-operation/global' {
  import { AddressProvider } from '@anchor-protocol/anchor.js';
  import { ContractAddress } from '@anchor-protocol/types';
  import { WalletState } from '@anchor-protocol/wallet-provider';
  import { ApolloClient } from '@apollo/client';
  import { Constants } from 'base/contexts/contants';

  interface GlobalDependency extends Constants {
    addressProvider: AddressProvider;
    address: ContractAddress;
    client: ApolloClient<any>;
    post: WalletState['post'];
  }
}
