import { AddressProvider } from '@anchor-protocol/anchor-js/address-provider/provider';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Msg } from '@terra-money/terra.js';
import { transactionFee } from 'env';
import React from 'react';
import { useAddressProvider } from 'contexts/contract';
import extension, { PostResponse } from 'deprecated/terra/extension';

interface ActionContainerProps {
  render: (execute: ActionExecute) => React.ReactElement;
}

export type ActionExecute = (fabricated: Fabricated) => Promise<PostResponse>;

export type Fabricated = (ap: AddressProvider) => Msg[];

export const ActionContainer: React.FunctionComponent<ActionContainerProps> = ({
  render,
}) => {
  const addressProviders = useAddressProvider();
  const { status, connect } = useWallet();

  const execute = (fabricated: Fabricated) =>
    new Promise<PostResponse>((resolve, reject) => {
      const options = {
          ...transactionFee,
          msgs: fabricated(addressProviders),
      }
      console.log('action.tsx..()', options);
      extension.post(
        options,
        (response) => {
          console.log('action.tsx..()', response);
          if (!response.success) reject(response.error);
          else resolve(response);
        },
      );
    });

  switch (status.status) {
    case 'ready':
      return render(execute);
    case 'not_connected':
      return <button onClick={connect}>Connect Wallet</button>;
    default:
      return null;
  }
};
