import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { fabricatebAssetClaim } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { WalletState } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import { pickClaimResult } from 'pages/basset/transactions/pickClaimResult';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

interface DependencyList {
  addressProvider: AddressProvider;
  post: WalletState['post'];
  client: ApolloClient<any>;
}

export const claimOptions = createOperationOptions({
  id: 'basset/claim',
  pipe: ({ addressProvider, post, client }: DependencyList) => [
    fabricatebAssetClaim, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    getTxInfo(client), // TxResult -> { TxResult, TxInfo }
    pickClaimResult, // { TxResult, TxInfo } -> ClaimResult
  ],
  renderBroadcast: (props) => {
    return JSON.stringify(props, null, 2);
  },
  //breakOnError: true,
});
