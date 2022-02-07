import { ChainId } from '@libs/evm-wallet';

export type Addresses = {
  crossAnchorBridge: string;
  ust: string;
};

export const addresses: Record<ChainId, Addresses> = {
  [ChainId.ETHEREUM_TESTNET]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251',
    ust: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5',
  },
  [ChainId.ETHEREUM_MAINNET]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251', // TODO
    ust: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5', // TODO
  },
};

export function getAddress(
  contractName: keyof Addresses,
  chainId: ChainId | undefined = ChainId.ETHEREUM_TESTNET,
): string {
  const filteredChainId = !addresses[chainId]
    ? ChainId.ETHEREUM_TESTNET
    : chainId;

  return addresses[filteredChainId][contractName];
}
