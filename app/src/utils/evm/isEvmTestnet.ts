import { EvmChainId } from '@libs/evm-wallet';

export const isEvmTestnet = (chain: EvmChainId): boolean => {
  switch (chain) {
    case EvmChainId.AVALANCHE_FUJI_TESTNET:
    case EvmChainId.ETHEREUM_ROPSTEN:
      return true;
  }
  return false;
};
