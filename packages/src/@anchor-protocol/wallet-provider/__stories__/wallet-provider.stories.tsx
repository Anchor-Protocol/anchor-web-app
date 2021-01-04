import {
  ChromeExtensionWalletProvider,
  useWallet,
} from '@anchor-protocol/wallet-provider';
import React, { ComponentType } from 'react';

export default {
  title: 'core/wallet-provider',
  decorators: [
    (Story: ComponentType) => (
      <ChromeExtensionWalletProvider>
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
        {status.status === 'not_installed' ? (
          <button onClick={() => install()}>Install</button>
        ) : status.status === 'not_connected' ? (
          <button onClick={() => connect()}>Connect</button>
        ) : status.status === 'ready' ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : null}
      </section>
    </div>
  );
};
