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
import { TxHelper } from '@libs/app-fns/tx/internal';
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

export interface SellAncTxParams {
  burnAmount: ANC;
  maxSpread: number;
}

export function useSellAncTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const bank = useAnchorBank();
  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const sendTx = useCallback(
    async (txParams: SellAncTxParams, helper: TxHelper) => {
      const result = await terraSdk.anc.sell(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.burnAmount),
        formatExecuteMsgNumber(
          big(ancPrice!.ANCPoolSize).div(ancPrice!.USTPoolSize),
        ) as UST,
        txParams.maxSpread.toString(),
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.ANC_SELL);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess, ancPrice],
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
        // sold
        const offer_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'offer_amount',
        );
        // earned
        const return_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'return_amount',
        );
        const spread_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'commission_amount',
        );

        const pricePerANC =
          return_amount && offer_amount
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<UST<Big>>)
            : undefined;

        const txFee = offer_amount
          ? (big(terraSdk.globalOverrides.gasFee).plus(
              min(big(offer_amount).mul(bank.tax.taxRate), bank.tax.maxTaxUUSD),
            ) as u<UST<Big>>)
          : undefined;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            offer_amount && {
              name: 'Sold',
              value:
                formatUSTWithPostfixUnits(demicrofy(offer_amount)) + ' ANC',
            },
            return_amount && {
              name: 'Earned',
              value:
                formatANCWithPostfixUnits(demicrofy(return_amount)) + ' UST',
            },
            pricePerANC && {
              name: 'Price per ANC',
              value: formatUSTWithPostfixUnits(pricePerANC) + ' UST',
            },
            tradingFee && {
              name: 'Trading Fee',
              value: formatUSTWithPostfixUnits(demicrofy(tradingFee)) + ' UST',
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [bank.tax, terraSdk],
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
