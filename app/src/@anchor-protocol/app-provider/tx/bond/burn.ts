import { bondBurnTx } from '@anchor-protocol/app-fns';
import { bLuna, Gas, Rate, u, UST } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BondBurnTxParams {
  burnAmount: bLuna;
  gasWanted: Gas;
  txFee: u<UST>;
  exchangeRate: Rate<string>;
  onTxSucceed?: () => void;
}

export function useBondBurnTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({
      burnAmount,
      gasWanted,
      txFee,
      exchangeRate,
      onTxSucceed,
    }: BondBurnTxParams) => {
      if (
        !connected ||
        !availablePost ||
        !terraWalletAddress ||
        !connectedWallet
      ) {
        throw new Error('Can not post!');
      }

      return bondBurnTx({
        // fabricatebAssetUnbond
        burnAmount,
        walletAddr: terraWalletAddress,
        bAssetTokenAddr: contractAddress.cw20.bLuna,
        bAssetHubAddr: contractAddress.bluna.hub,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: txFee,
        gasFee: gasWanted,
        gasAdjustment: constants.gasAdjustment,
        exchangeRate,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.BOND_BURN);
        },
      });
    },
    [
      availablePost,
      connected,
      connectedWallet,
      contractAddress.cw20.bLuna,
      contractAddress.bluna.hub,
      terraWalletAddress,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
