import { HumanAddr } from '@anchor-protocol/types';

export interface WalletHistory {
  walletHistory: HumanAddr[];
}

export const walletHistoryKey = '__anchor_wallet_history__';
