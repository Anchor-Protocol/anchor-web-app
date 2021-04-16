import { HumanAddr } from '@anchor-protocol/types';
import { AccAddress } from '@terra-money/terra.js';
import { useContext, useMemo } from 'react';
import { NetworkInfo, WalletStatus } from '../models';
import { WalletContext } from './useWallet';

export interface ConnectedWallet {
  network: NetworkInfo;
  walletAddress: HumanAddr;
}

export function useConnectedWallet(): ConnectedWallet | undefined {
  const { status, network, walletAddress } = useContext(WalletContext);

  const value = useMemo(() => {
    if (
      status === WalletStatus.WALLET_CONNECTED &&
      typeof walletAddress === 'string' &&
      AccAddress.validate(walletAddress)
    ) {
      return {
        network,
        walletAddress: walletAddress as HumanAddr,
      };
    } else {
      return undefined;
    }
  }, [network, status, walletAddress]);

  return value;
}
