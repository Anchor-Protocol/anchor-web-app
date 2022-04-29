import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import {
  formatAUSTWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { aUST, Rate, u } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatTokenInput,
  stripUUSD,
} from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { useTerraSdk } from 'crossanchor';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface WithdrawUstTxParams {
  withdrawAmount: aUST;
}

export function useWithdrawUstTx() {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: WithdrawUstTxParams, helper: TxHelper) => {
      const result = await terraSdk.redeemStable(
        formatTokenInput(txParams.withdrawAmount),
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk],
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
        const withdrawAmountUUSD = pickAttributeValueByKey<string>(
          transfer,
          'amount',
          (attrs) => attrs.reverse()[0],
        );

        const withdrawAmount = withdrawAmountUUSD
          ? stripUUSD(withdrawAmountUUSD)
          : undefined;

        const burnAmount = pickAttributeValueByKey<u<aUST>>(
          fromContract,
          'burn_amount',
        );

        const exchangeRate =
          withdrawAmount &&
          burnAmount &&
          (big(withdrawAmount).div(burnAmount) as Rate<BigSource> | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            withdrawAmount && {
              name: 'Withdraw Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(withdrawAmount)) + ' UST',
            },
            burnAmount && {
              name: 'Returned Amount',
              value:
                formatAUSTWithPostfixUnits(demicrofy(burnAmount)) + ' aUST',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
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
