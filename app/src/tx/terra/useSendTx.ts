import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { HumanAddr, Token } from '@anchor-protocol/types';
import { pickEvent, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { formatTokenInput } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { CurrencyInfo } from 'pages/send/models/currency';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface SendTxParams {
  toWalletAddress: HumanAddr;
  currency: CurrencyInfo;
  memo?: string;
  amount: Token;
}

export function useSendTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: SendTxParams, helper: TxHelper) => {
      const { currency, amount, toWalletAddress, memo } = txParams;

      const result = await terraSdk.send(
        currency.cw20Address
          ? { token: currency.cw20Address }
          : {
              utoken: `u${currency.value}`,
            },
        formatTokenInput(amount),
        connectedWallet!.walletAddress,
        toWalletAddress,
        memo,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.TERRA_SEND);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, helper: TxHelper) => {
      const rawLog = pickLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            helper.txHashReceipt(),
            //helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
  });

  return connectedWallet ? streamReturn : [null, null];
}
