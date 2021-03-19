import {
  ChromeExtensionWalletProvider,
  useWallet,
  WalletStatusType,
} from '@anchor-protocol/wallet-provider';
import React, { ComponentType } from 'react';

const network = {
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
      <ChromeExtensionWalletProvider defaultNetwork={network}>
        <Story />
      </ChromeExtensionWalletProvider>
    ),
  ],
};

export const Handle_Status = () => {
  const { status, install, connect, disconnect } = useWallet();

  return (
    <div>
      <section>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </section>
      <section style={{ margin: '20px 0' }}>
        {status.status === WalletStatusType.NOT_INSTALLED ? (
          <button onClick={() => install()}>Install</button>
        ) : status.status === WalletStatusType.NOT_CONNECTED ? (
          <button onClick={() => connect()}>Connect</button>
        ) : status.status === WalletStatusType.CONNECTED ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : null}
      </section>
    </div>
  );
};
