import { CreateTxOptions } from '@terra-money/terra.js';
import { Consumer, Context, createContext, useContext } from 'react';
import { NetworkInfo, WalletStatus } from '../models';
import { TxResult } from '../tx';

export enum ConnectType {
  EXTENSION = 'EXTENSION',
  WALLETCONNECT = 'WALLETCONNECT',
}

export interface Wallet {
  status: WalletStatus;
  network: NetworkInfo;
  walletAddress: string | null;
  connect: (type: ConnectType) => void;
  disconnect: () => void;
  recheckExtensionStatus: () => void;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  availableExtension: boolean;
}

// @ts-ignore
export const WalletContext: Context<Wallet> = createContext<Wallet>();

export function useWallet(): Wallet {
  return useContext(WalletContext);
}

export const WalletConsumer: Consumer<Wallet> = WalletContext.Consumer;
