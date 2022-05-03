import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import {
  formatAUSTWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { aUST, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatTokenInput,
} from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { useTerraSdk } from 'crossanchor';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface DepositUstTxParams {
  depositAmount: UST;
}

export function useDepositUstTx() {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: DepositUstTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.depositStable(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.depositAmount),
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      refetchQueries(ANCHOR_TX_KEY.EARN_DEPOSIT);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk],
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
        const depositAmount = pickAttributeValue<u<UST>>(fromContract, 4);

        const receivedAmount = pickAttributeValue<u<aUST>>(fromContract, 3);

        const exchangeRate =
          depositAmount &&
          receivedAmount &&
          (big(depositAmount).div(receivedAmount) as
            | Rate<BigSource>
            | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            depositAmount && {
              name: 'Deposit Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(depositAmount)) + ' UST',
            },
            receivedAmount && {
              name: 'Received Amount',
              value:
                formatAUSTWithPostfixUnits(demicrofy(receivedAmount)) + ' aUST',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
            },
            writer.txHashReceipt(),
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
    message: 'Depositing your UST',
  });

  return connectedWallet ? streamReturn : [null, null];
}
