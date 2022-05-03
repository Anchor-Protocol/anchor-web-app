import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { HumanAddr, Token } from '@anchor-protocol/types';
import { pickEvent, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
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
    async (txParams: SendTxParams, writer: TerraTxProgressWriter) => {
      const { currency, amount, toWalletAddress, memo } = txParams;

      const result = await terraSdk.send(
        connectedWallet!.walletAddress,
        currency.cw20Address
          ? { token: currency.cw20Address }
          : {
              utoken: `u${currency.value}`,
            },
        formatTokenInput(amount),
        toWalletAddress,
        memo,
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
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
    async (txInfo: TxInfo, writer: TerraTxProgressWriter) => {
      const rawLog = pickLog(txInfo, 0);

      if (!rawLog) {
        return writer.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return writer.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            writer.txHashReceipt(),
            //writer.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return writer.failedToParseTxResult();
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
    message: 'Sending your tokens',
  });

  return connectedWallet ? streamReturn : [null, null];
}
