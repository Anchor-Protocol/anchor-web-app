import {
  ANCHOR_TX_KEY,
  useAnchorWebapp,
  useBAssetInfoByTokenAddrQuery,
} from '@anchor-protocol/app-provider';
import { bAsset, CW20Addr, u } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { formatNumeric, formatTokenInput } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface ExportWhAssetTxParams {
  amount: bAsset;
}

export function useExportWhAssetTx(
  tokenAddr?: CW20Addr,
  onSuccess?: RefCallback<() => void>,
) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { data: bAssetInfo } = useBAssetInfoByTokenAddrQuery(tokenAddr);

  const sendTx = useCallback(
    async (txParams: ExportWhAssetTxParams, helper: TxHelper) => {
      const result = await terraSdk.whAsset.export(
        connectedWallet!.walletAddress,
        bAssetInfo!.converterConfig.anchor_token_address!,
        formatTokenInput(txParams.amount),
        bAssetInfo!.minter.minter,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BASSET_EXPORT);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess, bAssetInfo],
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
        const returnAmount = pickAttributeValue<u<bAsset>>(fromContract, 16);
        const burnAmount = pickAttributeValue<u<bAsset>>(fromContract, 17);

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burnAmount && {
              name: 'Provided amount',
              value:
                formatNumeric(burnAmount as u<any>) +
                ` ${bAssetInfo!.tokenDisplay.anchor.symbol}`,
            },
            returnAmount && {
              name: 'Converted amount',
              value:
                formatNumeric(
                  returnAmount as u<any>,
                  bAssetInfo!.tokenDisplay.wormhole.decimals,
                ) + ` ${bAssetInfo!.tokenDisplay.wormhole.symbol}`,
            },
            {
              name: 'Exchange rate',
              value: `1 ${bAssetInfo!.tokenDisplay.anchor.symbol} per ${
                bAssetInfo!.tokenDisplay.wormhole.symbol
              }`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [bAssetInfo],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
  });

  return connectedWallet && bAssetInfo ? streamReturn : [null, null];
}
