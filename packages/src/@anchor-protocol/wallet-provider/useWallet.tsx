import { HumanAddr } from '@anchor-protocol/types';
import type { ReactNode, RefObject } from 'react';
import { Consumer, Context, createContext, useContext } from 'react';
import {
  StationNetworkInfo,
  WalletReady,
  WalletStatus,
  WalletStatusType,
} from './types';

export interface WalletProviderProps {
  defaultNetwork: StationNetworkInfo;
  children: ReactNode | ((state: WalletState) => ReactNode);
  enableWatchConnection?: boolean;
}

export interface WalletState {
  status: WalletStatus;
  install: () => void;
  connect: () => void;
  disconnect: () => void;
  connectWalletAddress: (walletAddress: HumanAddr) => void;
  checkStatus: () => void;
  post: <SendData extends {}, Payload extends {}>(
    data: SendData,
  ) => Promise<{ name: string; payload: Payload }>;
  inTransactionProgress: RefObject<boolean>;
}

// @ts-ignore
export const WalletContext: Context<WalletState> = createContext<WalletState>();

export function useWallet(): WalletState {
  return useContext(WalletContext);
}

/**
 * if the return value is undefined
 * it means user can't send transaction
 */
export function useConnectedWallet(): WalletReady | undefined {
  const { status } = useContext(WalletContext);

  return status.status === WalletStatusType.CONNECTED ? status : undefined;
}

/**
 * if this value is undefined
 * it means user can't querying by his own wallet address
 */
export function useUserWallet(): WalletReady | undefined {
  const { status } = useContext(WalletContext);

  return status.status === WalletStatusType.CONNECTED ||
    status.status === WalletStatusType.WALLET_ADDRESS_CONNECTED
    ? status
    : undefined;
}

export const WalletConsumer: Consumer<WalletState> = WalletContext.Consumer;
