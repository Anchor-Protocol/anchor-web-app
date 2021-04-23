import { HumanAddr } from '@anchor-protocol/types';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { AccAddress, CreateTxOptions } from '@terra-money/terra.js';
import { useContext, useMemo } from 'react';
import { TxResult } from '../tx';
import { ConnectType, WalletStatus } from '../types';
import { WalletContext } from './useWallet';

export interface ConnectedWallet {
  network: NetworkInfo;
  terraAddress: HumanAddr;
  walletAddress: HumanAddr;
  design?: string;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  availablePost: boolean;
}

export function useConnectedWallet(): ConnectedWallet | undefined {
  const { status, network, wallets, post } = useContext(WalletContext);

  const value = useMemo<ConnectedWallet | undefined>(() => {
    try {
      if (
        status === WalletStatus.WALLET_CONNECTED &&
        wallets.length > 0 &&
        AccAddress.validate(wallets[0].terraAddress)
      ) {
        const { terraAddress, connectType, design } = wallets[0];

        return {
          network,
          terraAddress: terraAddress as HumanAddr,
          walletAddress: terraAddress as HumanAddr,
          design,
          post: (tx: CreateTxOptions) => {
            return post(tx, { network, terraAddress });
          },
          availablePost:
            connectType === ConnectType.CHROME_EXTENSION ||
            connectType === ConnectType.WALLETCONNECT,
        };
      } else {
        return undefined;
      }
    } catch {
      return undefined;
    }
  }, [network, post, status, wallets]);

  return value;
}
