import { Msg, StdFee } from '@terra-money/terra.js';
import React from 'react';
import { useWallet } from '../hooks/use-wallet';
import { useAddressProvider } from '../providers/address-provider';
import extension, { PostResponse } from '../terra/extension';

interface ActionContainerProps {
  render: (execute: ActionExecute) => React.ReactElement;
}

export type ActionExecute = (fabricated: Fabricated) => Promise<PostResponse>;

export type Fabricated = (ap: AddressProvider.Provider) => Msg[];

export const ActionContainer: React.FunctionComponent<ActionContainerProps> = ({
  render,
}) => {
  const addressProviders = useAddressProvider();
  const { address, connect } = useWallet();

  const execute = (fabricated: Fabricated) =>
    new Promise<PostResponse>((resolve, reject) => {
      extension.post(
        {
          gasPrices: '0.0015uusd',
          msgs: fabricated(addressProviders),
          fee: new StdFee(503333, '5000000000000uusd'),
          gasAdjustment: 1.4,
        },
        (response) => {
          if (!response.success) reject(response.error);
          else resolve(response);
        },
      );
    });

  return address ? (
    render(execute)
  ) : (
    <button onClick={() => connect()}>connect wallet</button>
  );
};
