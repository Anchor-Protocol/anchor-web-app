import { HumanAddr } from '@anchor-protocol/types';
import {
  ChromeExtensionWalletProvider,
  useWallet,
  WalletStatusType,
} from '@anchor-protocol/wallet-provider';
import { AccAddress } from '@terra-money/terra.js';
import React, { ComponentType, useMemo, useState } from 'react';

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
  const {
    status,
    install,
    connect,
    disconnect,
    connectWalletAddress,
  } = useWallet();

  const [walletAddress, setWalletAddress] = useState('');

  const invalidWalletAddress = useMemo(
    () => AccAddress.validate(walletAddress),
    [walletAddress],
  );

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
        ) : status.status === WalletStatusType.CONNECTED ||
          status.status === WalletStatusType.WALLET_ADDRESS_CONNECTED ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : null}
      </section>

      {status.status !== WalletStatusType.WALLET_ADDRESS_CONNECTED && (
        <div>
          <input
            type="text"
            value={walletAddress}
            onChange={({ target }) => setWalletAddress(target.value)}
          />
          <button
            disabled={invalidWalletAddress}
            onClick={() => connectWalletAddress(walletAddress as HumanAddr)}
          >
            Connect with Wallet Address
          </button>
        </div>
      )}
    </div>
  );
};
