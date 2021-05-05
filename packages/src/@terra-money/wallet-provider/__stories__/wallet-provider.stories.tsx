import {
  useWallet,
  WalletProvider,
  WalletStatus,
} from '@terra-money/wallet-provider';
import React, { ComponentType } from 'react';

const defaultNetwork = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

export default {
  title: 'core/wallet-provider',
  decorators: [
    (Story: ComponentType) => (
      <WalletProvider
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={{}}
        createReadonlyWalletSession={() =>
          Promise.resolve({
            terraAddress: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9',
            network: defaultNetwork,
          })
        }
      >
        <Story />
      </WalletProvider>
    ),
  ],
};

export const Connect = () => {
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    connect,
    disconnect,
  } = useWallet();

  return (
    <div>
      <section>
        <pre>
          {JSON.stringify(
            {
              status,
              network,
              wallets,
              availableConnectTypes,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <section style={{ margin: '20px 0' }}>
        {status === WalletStatus.WALLET_NOT_CONNECTED ? (
          <>
            {availableConnectTypes.map((connectType) => (
              <button key={connectType} onClick={() => connect(connectType)}>
                Connect with {connectType}
              </button>
            ))}
          </>
        ) : status === WalletStatus.WALLET_CONNECTED ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : null}
      </section>
    </div>
  );
};
