import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { TxEventHandler, useTx } from './useTx';
import {
  CrossChainEvent,
  CrossChainEventKind,
  CrossChainTxResponse,
  TerraWormholeExitedPayload,
} from '@anchor-protocol/crossanchor-sdk';
import { RedemptionDisplay, useRedemptions } from './storage/useRedemptions';
import { useNavigate } from 'react-router-dom';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useCallback } from 'react';
import { useEvmWallet } from '@libs/evm-wallet';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export const useRedeemableTx = <TxParams>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender>,
    handleEvent: TxEventHandler<TxParams>,
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  parseRedemptionDisplay: (txParams: TxParams) => RedemptionDisplay,
): StreamReturn<TxParams, TxRender> => {
  const xAnchor = useEvmCrossAnchorSdk();
  const { saveRedemption, removeRedemption } = useRedemptions();
  const navigate = useNavigate();
  const { provider } = useEvmWallet();

  if (provider) {
    provider?.getLogs({ address: xAnchor.ustContract.address });
  }

  const onTxEvent = useCallback(
    (event: CrossChainEvent<ContractReceipt>, txParams: TxParams) => {
      if (event.kind === CrossChainEventKind.TerraWormholeExited) {
        const payload =
          event.payload as TerraWormholeExitedPayload<ContractReceipt>;
        saveRedemption({
          ...payload.redemption,
          tx: payload.tx,
          display: parseRedemptionDisplay(txParams),
        });
      }
    },
    [saveRedemption, parseRedemptionDisplay],
  );

  return useTx(
    async (
      txParams: TxParams,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<TxParams>,
    ) => {
      const resp = await sendTx(txParams, renderTxResults, handleEvent);
      const redemption = resp.redemption;

      if (xAnchor.skipRedemption) {
        saveRedemption({
          ...redemption,
          display: parseRedemptionDisplay(txParams),
          tx: resp.tx,
        });
        navigate(`/bridge/redeem/${redemption.outgoingSequence}`);
      } else {
        removeRedemption(resp.redemption.outgoingSequence);
      }

      return resp;
    },
    parseTx,
    emptyTxResult,
    onTxEvent,
  );
};
