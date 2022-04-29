import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import {
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { ANC, AncUstLP, u } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, formatTokenInput, stripUUSD } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../../useRenderedTx';

export interface WithdrawAncLpTxParams {
  lpAmount: AncUstLP;
}

export function useWithdrawAncLpTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: WithdrawAncLpTxParams, helper: TxHelper) => {
      const result = await terraSdk.anc.lp.withdraw(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.lpAmount),
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.ANC_ANC_UST_LP_WITHDRAW);

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
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const burned = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'withdrawn_share',
        );

        const receivedAnc = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[1],
        );
        const receivedUusd = pickAttributeValueByKey<string>(
          transfer,
          'amount',
          (attrs) => attrs.reverse()[0],
        );
        const receivedUst = !!receivedUusd && stripUUSD(receivedUusd);

        //const transferAmount = pickAttributeValueByKey<string>(
        //  transfer,
        //  'amount',
        //);
        //const transferFee = transferAmount && stripUUSD(transferAmount);

        const txFee = undefined;
        //!!transferFee && (big($.fixedGas).plus(transferFee) as u<UST<Big>>);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burned && {
              name: 'Burned',
              value: formatLP(demicrofy(burned)) + ' ANC-UST LP',
            },
            receivedAnc &&
              receivedUst && {
                name: 'Received',
                value:
                  formatANCWithPostfixUnits(demicrofy(receivedAnc)) +
                  ' ANC + ' +
                  formatUSTWithPostfixUnits(demicrofy(receivedUst)) +
                  ' UST',
              },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee ? txFee : undefined),
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
