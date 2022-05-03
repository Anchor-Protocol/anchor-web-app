import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatANCWithPostfixUnits } from '@anchor-protocol/notation';
import { ANC, Astro, u } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, formatUToken } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../../useRenderedTx';

export interface ClaimAncLpRewardsTxParams {}

export function useClaimAncLpRewardsTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (
      txParams: ClaimAncLpRewardsTxParams,
      writer: TerraTxProgressWriter,
    ) => {
      const result = await terraSdk.anc.lp.claimRewards(
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.REWARDS_ANC_UST_LP_CLAIM);

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
        const claimedANC = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[0],
        );

        const claimedAstro = pickAttributeValueByKey<u<Astro>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[1],
        );

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            claimedANC && {
              name: 'Claimed ANC',
              value: formatANCWithPostfixUnits(demicrofy(claimedANC)) + ' ANC',
            },
            claimedAstro && {
              name: 'Claimed ASTRO',
              value: formatUToken(claimedAstro) + ' ASTRO',
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
    network: connectedWallet?.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
    message: 'Claiming rewards',
  });

  return connectedWallet ? streamReturn : [null, null];
}
