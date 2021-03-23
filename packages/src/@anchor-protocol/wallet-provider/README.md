# `@anchor-protocol/wallet-provider`

<https://anchor-storybook.vercel.app/?path=/story/core-wallet-provider--handle-status>

# API

## `ChromeExtensionWalletProvider`

### Options

- `defaultNetwork` is fallback network to use before connecting wallet (the chrome extension)
- `enableWatchConnection` enable this if you want to send transaction to terra station

### Example

```js
import { ChromeExtensionWalletProvider } from '@anchor-protocol/wallet-provider';

const defaultNetwork = {
  chainID: 'tequila-0004',
  fcd: 'https://tequila-fcd.terra.dev',
  lcd: 'https://tequila-lcd.terra.dev',
  name: 'testnet',
  ws: 'wss://tequila-ws.terra.dev',
};

function App() {
  return (
    <ChromeExtensionWalletProvider
      defaultNetwork={defaultNetwork}
      enableWatchConnection
    >
      <YOUR_APP />
    </ChromeExtensionWalletProvider>
  );
}
```

## `useWallet()`

### API

<!-- source useWallet.tsx --pick "WaletState useWallet" -->

[useWallet.tsx](useWallet.tsx)

```tsx
export function useWallet(): WalletState {}
```

<!-- /source -->

### Example

```js
import { useWallet, WalletStatusType } from '@anchor-protocol/wallet-provider';

function Component() {
  const { status, post } = useWallet();

  return (
    <div>
      <pre>{JSON.stringify(status, null, 2)}</pre>

      {status.status === WalletStatusType.CONNECTED && (
        <button onClick={() => post(createTransaction())}>
          Send Transaction
        </button>
      )}
    </div>
  );
}
```
