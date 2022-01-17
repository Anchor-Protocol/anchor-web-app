import { useContext } from 'react';

import { Web3ReactContext } from '../Web3ReactProvider';

export function useEvmWallet() {
  const {
    connector,
    hooks: {
      useAccount,
      useChainId,
      useError,
      useIsActivating,
      useIsActive,
      useProvider,
    },
  } = useContext(Web3ReactContext);

  return {
    connector,
    address: useAccount(),
    chainId: useChainId(),
    error: useError(),
    isActivating: useIsActivating(),
    isActive: useIsActive(),
    provider: useProvider(),
  };
}
