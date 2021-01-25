import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider';
import { fabricatebAssetBond } from '@anchor-protocol/anchor-js/fabricators';
import {
  createOperationOptions,
  timeout,
} from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { WalletState } from '@anchor-protocol/wallet-provider';
import { ApolloClient } from '@apollo/client';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { pickMintResult } from 'pages/basset/transactions/pickMintResult';
import React from 'react';
import { createContractMsg } from 'transactions/createContractMsg';
import { getTxInfo } from 'transactions/getTxInfo';
import { postContractMsg } from 'transactions/postContractMsg';
import { parseTxResult } from 'transactions/tx';

interface DependencyList {
  addressProvider: AddressProvider;
  post: WalletState['post'];
  client: ApolloClient<any>;
}

export const mintOptions = createOperationOptions({
  id: 'basset/mint',
  pipe: ({ addressProvider, post, client }: DependencyList) => [
    fabricatebAssetBond, // Option -> ((AddressProvider) -> MsgExecuteContract[])
    createContractMsg(addressProvider), // ((AddressProvider) -> MsgExecuteContract[]) -> MsgExecuteContract[]
    timeout(postContractMsg(post), 1000 * 60 * 2), // MsgExecuteContract[] -> Promise<StringifiedTxResult>
    parseTxResult, // StringifiedTxResult -> TxResult
    getTxInfo(client), // TxResult -> { TxResult, TxInfo }
    pickMintResult, // { TxResult, TxInfo } -> TransactionResult
  ],
  renderBroadcast: (mintResult) => {
    if (
      mintResult?.status === 'in-progress' ||
      mintResult?.status === 'done' ||
      mintResult?.status === 'fault'
    ) {
      return (
        <>
          {mintResult.status === 'done' ? (
            <div>
              <pre>{JSON.stringify(mintResult.data, null, 2)}</pre>
              <ActionButton
                style={{ width: 200 }}
                onClick={() => {
                  mintResult.reset();
                }}
              >
                Exit
              </ActionButton>
            </div>
          ) : (
            <TransactionRenderer result={mintResult} />
          )}
        </>
      );
    }
    return null;
  },
  //breakOnError: true,
});
