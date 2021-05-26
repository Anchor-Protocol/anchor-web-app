# `@terra-money/wallet-provider`

- Storybook: <https://anchor-storybook.vercel.app/?path=/story/core-wallet-provider--handle-status>
- Documentation (Korean): <https://www.notion.so/ssen/terra-money-wallet-provider-0-12-2-3dee9af5a294484ca3ff56f8df17c7f0>

# Install

```sh
yarn add @terra-money/wallet-provider
```

# API Usage

## `<WalletProvider>`

```jsx
import { WalletProvider } from '@terra-money/wallet-provider';

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

function App() {
  return (
    <WalletProvider
      defaultNetwork={mainnet}
      walletConnectChainIds={{
        0: testnet,
        1: mainnet,
      }}
    >
      <YOUR_APP />
    </WalletProvider>
  );
}
```

## `useWallet()`

```jsx
import { useWallet } from '@terra-money/wallet-provider';

function Component() {
  const {
    status,
    network,
    availableConnectTypes,
    connect,
    availableInstallTypes,
    install,
    wallets,
    disconnect,
    recheckStatus,
    post,
  } = useWallet();

  return null;
}
```

## `useConnectedWallet()`

```jsx
import {
  useConnectedWallet,
  ConnectedWallet,
} from '@terra-money/wallet-provider';

function Component() {
  const connectedWallet: ConnectedWallet | undefined = useConnectedWallet();

  return null;
}
```
