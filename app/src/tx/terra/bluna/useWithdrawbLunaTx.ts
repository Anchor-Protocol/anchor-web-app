import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatLuna } from '@anchor-protocol/notation';
import {
  pickAttributeValue,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, stripULuna } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface WithdrawbLunaTxParams {}

export function useWithdrawbLunaTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: WithdrawbLunaTxParams, helper: TxHelper) => {
      const result = await terraSdk.bLuna.withdraw(
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BOND_WITHDRAW);

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

      const transfer = pickEvent(rawLog, 'transfer');

      if (!transfer) {
        return helper.failedToFindEvents('transfer');
      }

      try {
        const unbondedAmount = pickAttributeValue<string>(transfer, 2);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            !!unbondedAmount && {
              name: 'Unbonded Amount',
              value:
                formatLuna(demicrofy(stripULuna(unbondedAmount))) + ' LUNA',
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
