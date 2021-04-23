# `@terra-money/wallet-provider`

<https://anchor-storybook.vercel.app/?path=/story/core-wallet-provider--handle-status>

# Usage

```jsx
import { WalletProvider } from '@terra-money/wallet-provider';

const mainnet = {
  chainID: 'columbus-4',
  fcd: 'https://fcd.terra.dev',
  lcd: 'https://lcd.terra.dev',
  name: 'mainnet',
  ws: 'wss://fcd.terra.dev',
};

const testnet = {
  chainID: 'tequila-0004',
  fcd: 'https://tequila-fcd.terra.dev',
  lcd: 'https://tequila-lcd.terra.dev',
  name: 'testnet',
  ws: 'wss://tequila-ws.terra.dev',
};

function App() {
  return (
    <WalletProvider
      defaultNetwork={mainnet}
      walletConnectChainIds={
        new Map([
          [1, mainnet],
          [2, testnet],
        ])
      }
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
