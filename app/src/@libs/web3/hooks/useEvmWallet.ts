import { useContext } from 'react';

import { Web3Context } from '../Web3Provider';

export function useEvmWallet() {
  return useContext(Web3Context);
}
