declare module '@terra-dev/broadcastable-operation/global' {
  import { AddressProvider } from '@anchor-protocol/anchor.js';
  import { ContractAddress } from '@anchor-protocol/types';
  import { TxResult } from '@anchor-protocol/wallet-provider2';
  import { ApolloClient } from '@apollo/client';
  import { CreateTxOptions } from '@terra-money/terra.js';
  import { Constants } from 'base/contexts/contants';

  interface GlobalDependency extends Constants {
    addressProvider: AddressProvider;
    address: ContractAddress;
    client: ApolloClient<any>;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
  }
}
