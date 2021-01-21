import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext } from 'react';
import { StationNetworkInfo, WalletStatus } from './types';

export interface WalletProviderProps {
  defaultNetwork: StationNetworkInfo;
  children: ReactNode | ((state: WalletState) => ReactNode);
}

export interface WalletState {
  status: WalletStatus;
  install: () => void;
  connect: () => void;
  disconnect: () => void;
  checkStatus: () => void;
  post: <SendData extends {}, Payload extends {}>(
    data: SendData,
  ) => Promise<{ name: string; payload: Payload }>;
}

// @ts-ignore
export const WalletContext: Context<WalletState> = createContext<WalletState>();

export function useWallet(): WalletState {
  return useContext(WalletContext);
}

export const WalletConsumer: Consumer<WalletState> = WalletContext.Consumer;
