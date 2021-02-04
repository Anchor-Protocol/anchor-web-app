import { WalletState } from '@anchor-protocol/wallet-provider';
import { CreateTxOptions } from '@terra-money/terra.js';
import { StringifiedTxResult } from 'transactions/tx';

export const postContractMsg = (post: WalletState['post']) => (
  options: CreateTxOptions,
) => {
  return post<CreateTxOptions, StringifiedTxResult>(options).then(
    ({ payload }) => payload,
  );
};
