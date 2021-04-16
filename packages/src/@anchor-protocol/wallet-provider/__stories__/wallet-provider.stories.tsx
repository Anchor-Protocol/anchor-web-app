import {
  ConnectType,
  useWallet,
  WalletProvider,
  WalletStatus,
} from '@anchor-protocol/wallet-provider';
import React, { ComponentType } from 'react';

const defaultNetwork = {
  chainID: 'tequila-0004',
  fcd: 'https://tequila-fcd.terra.dev',
  lcd: 'https://tequila-lcd.terra.dev',
  name: 'testnet',
  ws: 'wss://tequila-ws.terra.dev',
};

export default {
  title: 'core/wallet-provider',
  decorators: [
    (Story: ComponentType) => (
      <WalletProvider
        defaultNetwork={defaultNetwork}
        walletConnectChainIds={new Map()}
      >
        <Story />
      </WalletProvider>
    ),
  ],
};

export const Handle_Status = () => {
  const {
    status,
    network,
    walletAddress,
    availableExtension,
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
              walletAddress,
              availableExtension,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <section style={{ margin: '20px 0' }}>
        {status === WalletStatus.WALLET_NOT_CONNECTED ? (
          <>
            <button onClick={() => connect(ConnectType.WALLETCONNECT)}>
              Connect with Wallet Connect
            </button>
            {availableExtension && (
              <button onClick={() => connect(ConnectType.EXTENSION)}>
                Connect with Extension
              </button>
            )}
          </>
        ) : status === WalletStatus.WALLET_CONNECTED ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : null}
      </section>
    </div>
  );
};
