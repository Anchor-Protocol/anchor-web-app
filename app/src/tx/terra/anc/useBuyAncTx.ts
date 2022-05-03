import {
  ANCHOR_TX_KEY,
  useAnchorBank,
  useAnchorWebapp,
  useAncPriceQuery,
} from '@anchor-protocol/app-provider';
import {
  formatANCWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import { min } from '@libs/big-math';
import {
  demicrofy,
  formatExecuteMsgNumber,
  formatTokenInput,
} from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface BuyAncTxParams {
  amount: UST;
  maxSpread: string;
}

export function useBuyAncTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { tax } = useAnchorBank();
  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const sendTx = useCallback(
    async (txParams: BuyAncTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.anc.buy(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.amount),
        formatExecuteMsgNumber(
          big(ancPrice!.USTPoolSize).div(ancPrice!.ANCPoolSize),
        ) as UST,
        txParams.maxSpread,
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.ANC_BUY);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess, ancPrice],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, writer: TerraTxProgressWriter) => {
      const rawLog = pickLog(txInfo, 0);

      if (!rawLog) {
        return writer.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return writer.failedToFindEvents('from_contract');
      }

      try {
        const return_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'return_amount',
        );
        const offer_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'offer_amount',
        );
        const spread_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'commission_amount',
        );

        const pricePerANC =
          return_amount && offer_amount
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<ANC<Big>>)
            : undefined;
        const txFee = offer_amount
          ? (big(terraSdk.globalOverrides.gasFee).plus(
              min(big(offer_amount).mul(tax.taxRate), tax.maxTaxUUSD),
            ) as u<UST<Big>>)
          : undefined;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            return_amount && {
              name: 'Bought',
              value:
                formatANCWithPostfixUnits(demicrofy(return_amount)) + ' ANC',
            },
            offer_amount && {
              name: 'Paid',
              value:
                formatUSTWithPostfixUnits(demicrofy(offer_amount)) + ' UST',
            },
            pricePerANC && {
              name: 'Paid/Bought',
              value: formatUSTWithPostfixUnits(pricePerANC) + ' UST',
            },
            tradingFee && {
              name: 'Trading Fee',
              value: formatANCWithPostfixUnits(demicrofy(tradingFee)) + ' ANC',
            },
            writer.txHashReceipt(),
            writer.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return writer.failedToParseTxResult();
      }
    },
    [tax, terraSdk],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
    message: 'Buying ANC for UST',
  });

  return connectedWallet ? streamReturn : [null, null];
}
