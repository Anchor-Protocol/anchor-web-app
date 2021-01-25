import { WalletState } from '@anchor-protocol/wallet-provider';
import { CreateTxOptions, MsgExecuteContract } from '@terra-money/terra.js';
import { TRANSACTION_FEE } from 'env';
import { StringifiedTxResult } from 'transactions/tx';

export const postContractMsg = (post: WalletState['post']) => (
  msgs: MsgExecuteContract[],
) => {
  return post<CreateTxOptions, StringifiedTxResult>({
    ...TRANSACTION_FEE,
    msgs,
  }).then(({ payload }) => payload);
};
