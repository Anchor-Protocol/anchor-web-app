# `@terra-money/wallet-provider`

<https://anchor-storybook.vercel.app/?path=/story/core-wallet-provider--handle-status>

# Usage

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

```jsx
import { useWallet } from '@terra-money/wallet-provider';

function Component() {
  const {
    status,
    network,
    walletAddress,
    availableExtension,
    connect,
    disconnect,
  } = useWallet();

  return null;
}
```
