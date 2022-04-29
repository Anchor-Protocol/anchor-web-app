import {
  ANCHOR_TX_KEY,
  useAnchorWebapp,
  useBLunaExchangeRateQuery,
} from '@anchor-protocol/app-provider';
import { formatLuna } from '@anchor-protocol/notation';
import { bLuna, Luna, Rate, u } from '@anchor-protocol/types';
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
} from '@libs/formatter';
import { Dec, TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface BurnbLunaTxParams {
  burnAmount: bLuna;
}

export function useBurnbLunaTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { data: { state: exchangeRate } = {} } = useBLunaExchangeRateQuery();

  const rate = exchangeRate?.exchange_rate ?? ('1' as Rate<string>);

  const sendTx = useCallback(
    async (txParams: BurnbLunaTxParams, helper: TxHelper) => {
      const result = await terraSdk.bLuna.burn(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.burnAmount),
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BOND_BURN);

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

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const burnedAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'amount',
          (attrs) => attrs[0],
        );

        const expectedAmount = new Dec(burnedAmount)
          .mul(rate)
          .toString() as u<Luna>;

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burnedAmount && {
              name: 'Burned Amount',
              value: `${formatLuna(demicrofy(burnedAmount))} bLUNA`,
            },
            expectedAmount && {
              name: 'Expected Amount',
              value: `${formatLuna(demicrofy(expectedAmount))} LUNA`,
            },
            {
              name: 'Exchange Rate',
              value: `${formatFluidDecimalPoints(rate, 6)} LUNA per bLUNA`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [rate],
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
