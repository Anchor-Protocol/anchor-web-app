import { EvmChainId } from '@libs/evm-wallet';
import { EVMAddr } from '@libs/types';

export type Addresses = {
  crossAnchorBridge: EVMAddr;
  UST: EVMAddr;
  aUST: EVMAddr;
  ANC: EVMAddr;
};

const addresses: Record<EvmChainId, Addresses> = {
  [EvmChainId.ETHEREUM_ROPSTEN]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251' as EVMAddr,
    UST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    aUST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    ANC: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
  },
  [EvmChainId.ETHEREUM_MAINNET]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251' as EVMAddr, // TODO
    UST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    aUST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    ANC: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
  },
};

export function getAddress(
  chainId: EvmChainId,
  contractName: keyof Addresses,
): EVMAddr {
  return addresses[chainId][contractName];
}
