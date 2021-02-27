declare module '@anchor-protocol/broadcastable-operation/global' {
  import { AddressProvider } from '@anchor-protocol/anchor.js';
  import { ContractAddress } from '@anchor-protocol/types/contracts';
  import { WalletState } from '@anchor-protocol/wallet-provider';
  import { ApolloClient } from '@apollo/client';
  import { Constants } from 'contexts/contants';

  interface GlobalDependency extends Constants {
    address: ContractAddress;
    addressProvider: AddressProvider;
    client: ApolloClient<any>;
    post: WalletState['post'];
  }
}
