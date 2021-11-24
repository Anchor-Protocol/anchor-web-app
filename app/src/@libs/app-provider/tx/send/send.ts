import { sendTx } from '@libs/app-fns';
import { useFixedFee } from '@libs/app-provider/hooks/useFixedFee';
import { HumanAddr, terraswap, Token, u, UST } from '@libs/types';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useCallback } from 'react';
import { useApp } from '../../contexts/app';
import { TERRA_TX_KEYS } from '../../env';
import { useRefetchQueries } from '../../hooks/useRefetchQueries';
import { useUstTax } from '../../queries/terra/tax';

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

  const { queryClient, txErrorReporter, constants } = useApp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const { taxRate, maxTax } = useUstTax();

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
        taxRate,
        maxTaxUUSD: maxTax,
        fixedFee,
        gasWanted: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        queryClient,
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
      constants.gasAdjustment,
      constants.gasWanted,
      fixedFee,
      maxTax,
      refetchQueries,
      taxRate,
      txErrorReporter,
      queryClient,
    ],
  );

  return connectedWallet ? stream : null;
}
