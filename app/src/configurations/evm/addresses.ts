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
    aUST: '0x78D8036EB3Dcb4d8F099E9497d02CDaE202EA358' as EVMAddr,
    ANC: '0x86198E4994E67855F79F92b717dFb81f08265315' as EVMAddr,
  },
  [EvmChainId.ETHEREUM]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251' as EVMAddr, // TODO
    UST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    aUST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
    ANC: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
  },
  [EvmChainId.AVALANCHE]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251' as EVMAddr, // TODO
    UST: '0xb599c3590F42f8F995ECfa0f85D2980B76862fc1' as EVMAddr,
    aUST: '0xaB9A04808167C170A9EC4f8a87a0cD781ebcd55e' as EVMAddr,
    ANC: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as EVMAddr,
  },
  [EvmChainId.AVALANCHE_FUJI_TESTNET]: {
    crossAnchorBridge: '0x6BC753dDDa20488767ad501B06382398587df251' as EVMAddr, // TODO
    UST: '0xe09Ed38E5Cd1014444846f62376ac88C5232cDe9' as EVMAddr,
    aUST: '0x9d536781f462939Dd44DE1d6a4c4081349D9079C' as EVMAddr,
    ANC: '0x995Bd4430C81654AA344c3cBb484d9Eb9A46eD7c' as EVMAddr,
  },
};

export function getAddress(
  chainId: EvmChainId,
  contractName: keyof Addresses,
): EVMAddr {
  return addresses[chainId][contractName];
}
