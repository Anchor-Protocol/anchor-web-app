import { NetworkInfo } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';
import { Consumer, Context, createContext, useContext } from 'react';
import { TxResult } from '../tx';
import { ConnectType, WalletInfo, WalletStatus } from '../types';

export interface Wallet {
  availableConnectTypes: ConnectType[];
  availableInstallTypes: ConnectType[];
  status: WalletStatus;
  network: NetworkInfo;
  wallets: WalletInfo[];
  install: (type: ConnectType) => void;
  connect: (type: ConnectType) => void;
  disconnect: () => void;
  recheckStatus: () => void;

  /**
   * post transaction
   *
   * @param tx Transaction data
   * @param txTarget - not work at this time. for the future extension
   * @throws UserDenied user denied the tx
   * @throws CreateTxFailed did not create txhash (error dose not broadcasted)
   * @throws TxFailed created txhash (error broadcated)
   * @throws Timeout user does not act anything in some time
   * @throws TxUnspecifiedError unknown error
   */
  post: (
    tx: CreateTxOptions,
    txTarget?: { network?: NetworkInfo; terraAddress?: string },
  ) => Promise<TxResult>;
}

// @ts-ignore
export const WalletContext: Context<Wallet> = createContext<Wallet>();

export function useWallet(): Wallet {
  return useContext(WalletContext);
}

export const WalletConsumer: Consumer<Wallet> = WalletContext.Consumer;
