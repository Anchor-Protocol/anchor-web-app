import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { ANC, u, UST } from '@anchor-protocol/types';
import { govCreatePollTx } from '@anchor-protocol/webapp-fns';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
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

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

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
        fixedGas: constants.fixedGas.toString() as u<UST>,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        mantleEndpoint,
        mantleFetch,
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
      constants.fixedGas,
      constants.gasWanted,
      constants.gasAdjustment,
      addressProvider,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
