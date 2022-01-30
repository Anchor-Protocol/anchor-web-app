import { ExecuteMsg, govCreatePollTx } from '@anchor-protocol/app-fns';
import { ANC } from '@anchor-protocol/types';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
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
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
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
      if (
        !availablePost ||
        !connected ||
        !connectedWallet ||
        !terraWalletAddress
      ) {
        throw new Error('Can not post!');
      }

      return govCreatePollTx({
        // fabricateGovCreatePoll
        walletAddr: terraWalletAddress,
        amount,
        title,
        description,
        link,
        executeMsgs,
        govAddr: contractAddress.anchorToken.gov,
        ancTokenAddr: contractAddress.cw20.ANC,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
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
      availablePost,
      connected,
      connectedWallet,
      contractAddress.anchorToken.gov,
      contractAddress.cw20.ANC,
      terraWalletAddress,
      fixedFee,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
