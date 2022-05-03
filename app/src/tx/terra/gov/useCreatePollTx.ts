import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { ANC } from '@anchor-protocol/types';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import { formatTokenInput } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export type ExecuteMsg = {
  order: number;
  contract: string;
  msg: string;
};

export interface CreatePollTxParams {
  amount: ANC;
  title: string;
  description: string;
  link: string | undefined;
  executeMsgs: ExecuteMsg[] | undefined;
}

export function useCreatePollTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const sendTx = useCallback(
    async (txParams: CreatePollTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.gov.createPoll(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.amount),
        {
          title: txParams.title,
          description: txParams.description,
          link: txParams.link,
          executeMsgs: txParams.executeMsgs,
        },
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.GOV_CREATE_POLL);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk, onSuccess],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, writer: TerraTxProgressWriter) => {
      try {
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [writer.txHashReceipt()],
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
    message: 'Creating poll',
  });

  return connectedWallet ? streamReturn : [null, null];
}
