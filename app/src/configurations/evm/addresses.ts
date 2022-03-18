import { EvmChainId } from '@libs/evm-wallet';
import { EVMAddr, ERC20Addr } from '@libs/types';

export type Addresses = {
  UST: ERC20Addr;
  aUST: ERC20Addr;
  ANC: ERC20Addr;
};

// TODO: read contracts from SDK
const addresses: Record<EvmChainId, Addresses> = {
  [EvmChainId.ETHEREUM_ROPSTEN]: {
    UST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as ERC20Addr,
    aUST: '0x78D8036EB3Dcb4d8F099E9497d02CDaE202EA358' as ERC20Addr,
    ANC: '0x86198E4994E67855F79F92b717dFb81f08265315' as ERC20Addr,
  },
  [EvmChainId.ETHEREUM]: {
    UST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as ERC20Addr,
    aUST: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as ERC20Addr,
    ANC: '0x67d574b0218DcA2eB790b5922C5dA6A7b77E25a5' as ERC20Addr,
  },
  [EvmChainId.AVALANCHE]: {
    UST: '0xb599c3590F42f8F995ECfa0f85D2980B76862fc1' as ERC20Addr,
    aUST: '0xaB9A04808167C170A9EC4f8a87a0cD781ebcd55e' as ERC20Addr,
    ANC: '0x734683CE4C946E0781540E2eD3e78f316aAFd6Ec' as ERC20Addr,
  },
  [EvmChainId.AVALANCHE_FUJI_TESTNET]: {
    UST: '0xe09Ed38E5Cd1014444846f62376ac88C5232cDe9' as ERC20Addr,
    aUST: '0x9d536781f462939Dd44DE1d6a4c4081349D9079C' as ERC20Addr,
    ANC: '0x995Bd4430C81654AA344c3cBb484d9Eb9A46eD7c' as ERC20Addr,
  },
};

export function getAddress<T extends EVMAddr | ERC20Addr>(
  chainId: EvmChainId,
  contractName: keyof Addresses,
): T {
  return addresses[chainId][contractName] as T;
}
