import {
  ANCHOR_TX_KEY,
  useAnchorBank,
  useAnchorWebapp,
  useAncPriceQuery,
} from '@anchor-protocol/app-provider';
import {
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, u, UST } from '@anchor-protocol/types';
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
import { demicrofy, formatTokenInput, stripUUSD } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../../useRenderedTx';

export interface ProvideAncLpTxParams {
  ancAmount: ANC;
  ustAmount: UST;
  slippageTolerance?: string;
}

export function useProvideAncLpTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { tax } = useAnchorBank();
  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const sendTx = useCallback(
    async (txParams: ProvideAncLpTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.anc.lp.provide(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.ancAmount),
        formatTokenInput(txParams.ustAmount),
        txParams.slippageTolerance ?? '0.01',
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_PROVIDE);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, writer: TerraTxProgressWriter) => {
      const rawLog = pickLog(txInfo, 1);

      if (!rawLog) {
        return writer.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return writer.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const depositedAnc = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
        );

        const depositedUusd = pickAttributeValueByKey<string>(
          transfer,
          'amount',
        );

        const depositedUst = depositedUusd && stripUUSD(depositedUusd);

        const received = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'share',
        );

        const simulatedUst =
          !!depositedAnc &&
          !!depositedUst &&
          !!ancPrice &&
          (big(big(depositedAnc).mul(ancPrice.ANCPrice)).plus(
            depositedUst,
          ) as u<UST<Big>>);

        const txFee =
          simulatedUst &&
          (big(terraSdk.globalOverrides.gasFee).plus(
            min(simulatedUst.mul(tax.taxRate), tax.maxTaxUUSD),
          ) as u<UST<Big>>);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            received && {
              name: 'Received',
              value: formatLP(demicrofy(received)) + ' ANC-UST LP',
            },
            !!depositedAnc &&
              !!depositedUst && {
                name: 'Deposited',
                value:
                  formatANCWithPostfixUnits(demicrofy(depositedAnc)) +
                  ' ANC + ' +
                  formatUSTWithPostfixUnits(demicrofy(depositedUst)) +
                  ' UST',
              },
            writer.txHashReceipt(),
            writer.txFeeReceipt(txFee ? txFee : undefined),
          ],
        } as TxResultRendering;
      } catch (error) {
        return writer.failedToParseTxResult();
      }
    },
    [ancPrice, tax, terraSdk],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
    message: 'Providing your ANC-UST LP',
  });

  return connectedWallet ? streamReturn : [null, null];
}
