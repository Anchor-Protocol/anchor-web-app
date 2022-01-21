import { Connection } from './types';

export const availableConnections: Connection[] = [
  {
    name: 'MetaMask',
    type: 'METAMASK',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  },
  {
    name: 'WalletConnect',
    type: 'WALLETCONNECT',
    icon: 'https://assets.terra.money/icon/wallet-provider/walletconnect.svg',
  },
];

export const availableConnectTypes = ['METAMASK', 'WALLETCONNECT'] as const;
