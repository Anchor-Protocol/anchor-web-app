import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatLuna } from '@anchor-protocol/notation';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatTokenInput,
} from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';
import big, { Big, BigSource } from 'big.js';
import { bLuna, Luna, Rate, u } from '@anchor-protocol/types';
import { pickLog } from '@libs/app-fns/queries/utils';

export interface SwapbLunaTxParams {
  burnAmount: bLuna;
  beliefPrice: Rate;
  maxSpread: number;
}

export function useSwapbLunaTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: SwapbLunaTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.bLuna.swap(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.burnAmount),
        txParams.beliefPrice,
        txParams.maxSpread.toString(),
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BOND_SWAP);

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

      if (!fromContract) {
        return writer.failedToFindEvents('from_contract');
      }

      try {
        const boughtAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'return_amount',
        );
        const paidAmount = pickAttributeValueByKey<u<bLuna>>(
          fromContract,
          'offer_amount',
        );
        const spreadAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'spread_amount',
        );
        const commissionAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'commission_amount',
        );

        const exchangeRate =
          boughtAmount &&
          paidAmount &&
          (big(boughtAmount).div(paidAmount) as Rate<BigSource> | undefined);

        const tradingFee =
          commissionAmount &&
          spreadAmount &&
          (big(commissionAmount).plus(spreadAmount) as u<Luna<Big>>);

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            paidAmount && {
              name: 'Paid Amount',
              value: `${formatLuna(demicrofy(paidAmount))} bLUNA`,
            },
            boughtAmount && {
              name: 'Bought Amount',
              value: `${formatLuna(demicrofy(boughtAmount))} LUNA`,
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: `${formatFluidDecimalPoints(
                exchangeRate,
                6,
              )} LUNA per bLUNA`,
            },
            writer.txHashReceipt(),
            tradingFee && {
              name: 'Trading Fee',
              value: formatLuna(demicrofy(tradingFee)) + ' LUNA',
            },
            writer.txFeeReceipt(),
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
  });

  return connectedWallet ? streamReturn : [null, null];
}
