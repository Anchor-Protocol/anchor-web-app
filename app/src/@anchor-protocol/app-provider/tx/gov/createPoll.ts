import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { ANC } from '@anchor-protocol/types';
import { govCreatePollTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface GovCreatePollTxParams {
  amount: ANC;
  title: string;
  description: string;
  link: string | undefined;
  executeMsgs: ExecuteMsg[] | undefined;

  onTxSucceed?: () => void;
}

export function useGovCreatePollTx() {
  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, addressProvider, constants } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({
      amount,
      title,
      description,
      link,
      executeMsgs,
      onTxSucceed,
    }: GovCreatePollTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return govCreatePollTx({
        // fabricateGovCreatePoll
        address: connectedWallet.walletAddress,
        amount,
        title,
        description,
        link,
        execute_msgs: executeMsgs,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.GOV_CREATE_POLL);
        },
      });
    },
    [
      connectedWallet,
      fixedFee,
      constants.gasWanted,
      constants.gasAdjustment,
      addressProvider,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
