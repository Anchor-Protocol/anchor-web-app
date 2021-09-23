import { HumanAddr, terraswap, Token, u, UST } from '@libs/types';
import { sendTx, Tax, TERRA_TX_KEYS, TokenBalances } from '@libs/webapp-fns';
import {
  useBank,
  useRefetchQueries,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useCallback } from 'react';

export interface SendTxParams {
  amount: u<Token>;
  toAddr: HumanAddr;
  asset: terraswap.AssetInfo;
  memo?: string;
  txFee: u<UST>;

  onTxSucceed?: () => void;
}

export function useSendTx() {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, txErrorReporter, constants } =
    useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const { tax } = useBank<TokenBalances, Tax>();

  const stream = useCallback(
    ({ asset, memo, toAddr, amount, txFee, onTxSucceed }: SendTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error(`Can't post!`);
      }

      return sendTx({
        txFee,
        asset,
        memo,
        toAddr,
        amount,
        walletAddr: connectedWallet.walletAddress,
        tax,
        fixedGas: constants.fixedGas,
        gasFee: constants.gasFee,
        gasAdjustment: constants.gasAdjustment,
        mantleEndpoint,
        mantleFetch,
        txErrorReporter,
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(TERRA_TX_KEYS.SEND);
        },
        network: connectedWallet.network,
        post: connectedWallet.post,
      });
    },
    [
      connectedWallet,
      constants.fixedGas,
      constants.gasAdjustment,
      constants.gasFee,
      mantleEndpoint,
      mantleFetch,
      refetchQueries,
      tax,
      txErrorReporter,
    ],
  );

  return connectedWallet ? stream : null;
}
