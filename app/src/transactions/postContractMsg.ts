import { WalletState } from '@anchor-protocol/wallet-provider';
import { CreateTxOptions } from '@terra-money/terra.js';
import { TRANSACTION_FEE } from 'env';
import { StringifiedTxResult } from 'transactions/tx';

export const postContractMsg = (post: WalletState['post']) => (
  options: CreateTxOptions,
) => {
  const finalOptions: CreateTxOptions = {
    ...TRANSACTION_FEE,
    ...options,
  };
  console.log(
    'postContractMsg.ts..()',
    finalOptions,
    finalOptions.fee?.amount.toString(),
  );
  return post<CreateTxOptions, StringifiedTxResult>(finalOptions).then(
    ({ payload }) => payload,
  );
};
