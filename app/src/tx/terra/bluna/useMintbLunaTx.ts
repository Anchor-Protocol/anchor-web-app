import {
  ANCHOR_TX_KEY,
  useAnchorWebapp,
  useBLunaExchangeRateQuery,
} from '@anchor-protocol/app-provider';
import { formatLuna } from '@anchor-protocol/notation';
import { bLuna, Luna, Rate, u } from '@anchor-protocol/types';
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
import { useTerraSdk } from 'crossanchor';
import { RefCallback } from 'hooks';
import { useCallback } from 'react';
import { useRenderedTx } from '../useRenderedTx';

export interface MintbLunaTxParams {
  mintAmount: Luna;
}

export function useMintbLunaTx(onSuccess?: RefCallback<() => void>) {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { data: { state: exchangeRate } = {} } = useBLunaExchangeRateQuery();

  const rate = exchangeRate?.exchange_rate ?? ('1' as Rate<string>);

  const sendTx = useCallback(
    async (txParams: MintbLunaTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.bLuna.mint(
        connectedWallet!.walletAddress,
        formatTokenInput(txParams.mintAmount),
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      onSuccess?.();

      refetchQueries(ANCHOR_TX_KEY.BOND_MINT);

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
        const bondedAmount = pickAttributeValue<u<Luna>>(fromContract, 3);

        const mintedAmount = pickAttributeValue<u<bLuna>>(fromContract, 4);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            bondedAmount && {
              name: 'Bonded Amount',
              value: `${formatLuna(demicrofy(bondedAmount))} LUNA`,
            },
            mintedAmount && {
              name: 'Minted Amount',
              value: `${formatLuna(demicrofy(mintedAmount))} bLUNA`,
            },
            {
              name: 'Exchange Rate',
              value: `${formatFluidDecimalPoints(rate, 6)} bLUNA per LUNA`,
            },
            writer.txHashReceipt(),
            writer.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return writer.failedToParseTxResult();
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
    message: 'Minting your bLuna',
  });

  return connectedWallet ? streamReturn : [null, null];
}
