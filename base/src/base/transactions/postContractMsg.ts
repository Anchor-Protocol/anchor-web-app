import { TxResult } from '@anchor-protocol/wallet-provider';
import { CreateTxOptions } from '@terra-money/terra.js';

export const postContractMsg = (
  post: (tx: CreateTxOptions) => Promise<TxResult>,
) => (options: CreateTxOptions) => {
  return post(options);
};
