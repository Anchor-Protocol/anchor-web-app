import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';
import { Connection, ConnectType } from './types';

export const AvailableConnections: Connection[] = [
  {
    name: 'MetaMask',
    type: ConnectType.MetaMask,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  },
  {
    name: 'WalletConnect',
    type: ConnectType.WalletConnect,
    icon: 'https://assets.terra.money/icon/wallet-provider/walletconnect.svg',
  },
];

export const SupportedChainIds: EvmChainId[] = [
  EvmChainId.ETHEREUM,
  EvmChainId.ETHEREUM_ROPSTEN,
  EvmChainId.AVALANCHE,
  EvmChainId.AVALANCHE_FUJI_TESTNET,
];

export const SupportedChainRpcs: Record<EvmChainId, string> = {
  [EvmChainId.ETHEREUM]: 'https://main-rpc.linkpool.io',
  // TODO: add infura key to env variables
  [EvmChainId.ETHEREUM_ROPSTEN]: `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`,
  [EvmChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [EvmChainId.AVALANCHE_FUJI_TESTNET]:
    'https://api.avax-test.network/ext/bc/C/rpc',
};
