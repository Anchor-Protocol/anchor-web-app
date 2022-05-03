import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { Dec, TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { RewardBreakdown } from 'pages/basset/hooks/useRewardsBreakdown';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface ClaimWhAssetRewardsTxParams {
  rewardBreakdowns: RewardBreakdown[];
}

type RewardLogWithDisplay = {
  rewards: string;
  contract: string;
  symbol: string;
};

export function useClaimWhAssetRewardsTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (
      txParams: ClaimWhAssetRewardsTxParams,
      writer: TerraTxProgressWriter,
    ) => {
      const result = await terraSdk.whAsset.claimRewards(
        connectedWallet!.walletAddress,
        txParams.rewardBreakdowns.map((r) => r.rewardAddr),
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BOND_CLAIM);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess],
  );

  const renderResults = useCallback(
    async (
      txInfo: TxInfo,
      writer: TerraTxProgressWriter,
      txParams: ClaimWhAssetRewardsTxParams,
    ) => {
      const rawLogs = txInfo.logs ?? [];

      const rewardBreakdownByRewardContract = txParams.rewardBreakdowns.reduce(
        (acc, curr) => ({ ...acc, [curr.rewardAddr]: curr }),
        {} as { [k: string]: RewardBreakdown },
      );

      const rewardLogsWithDisplay = rawLogs.reduce((acc, curr) => {
        const wasm = pickEvent(curr, 'wasm');
        if (wasm) {
          const rewards = pickAttributeValueByKey<string>(wasm, 'rewards');
          const contract = pickAttributeValueByKey<string>(
            wasm,
            'contract_address',
          );

          if (rewards && contract) {
            return [
              ...acc,
              {
                rewards,
                contract,
                symbol: rewardBreakdownByRewardContract[contract].symbol,
              },
            ];
          }
        }

        return acc;
      }, [] as RewardLogWithDisplay[]);

      const total = rewardLogsWithDisplay.reduce(
        (acc, curr) => acc.add(curr.rewards),
        new Dec(0),
      );

      try {
        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            ...rewardLogsWithDisplay.map((rewardLog) => ({
              name: `${rewardLog.symbol ?? '???'} Reward`,
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(rewardLog.rewards as u<UST>),
                ) + ' UST',
            })),
            total && {
              name: 'Total Rewards',
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(total.toString() as u<UST>),
                ) + ' UST',
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
    message: 'Claiming rewards',
  });

  return connectedWallet ? streamReturn : [null, null];
}
