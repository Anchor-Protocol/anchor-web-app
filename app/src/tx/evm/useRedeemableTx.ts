import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import {
  CrossChainEvent,
  CrossChainEventHandler,
  CrossChainEventKind,
  CrossChainTxResponse,
  TerraWormholeExitedPayload,
} from '@anchor-protocol/crossanchor-sdk';
import {
  RedemptionDisplay,
  useRedemptionStorage,
} from './storage/useRedemptionStorage';
import { useNavigate } from 'react-router-dom';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useCallback } from 'react';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export const useRedeemableTx = <TxParams>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender>,
    handleEvent: CrossChainEventHandler,
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
  parseRedemptionDisplay: (txParams: TxParams) => RedemptionDisplay,
): StreamReturn<TxParams, TxRender> => {
  const evmSdk = useEvmCrossAnchorSdk();
  const { saveRedemption, removeRedemption } = useRedemptionStorage();
  const navigate = useNavigate();

  const onTxEvent = useCallback(
    (event: CrossChainEvent) => {
      if (event.kind === CrossChainEventKind.TerraWormholeExited) {
        const payload = event.payload as TerraWormholeExitedPayload;
        saveRedemption(payload.redemption);
      }
    },
    [saveRedemption],
  );

  return useTx(
    async (
      txParams: TxParams,
      renderTxResults: Subject<TxRender>,
      handleEvent: CrossChainEventHandler,
    ) => {
      const resp = await sendTx(txParams, renderTxResults, handleEvent);
      const redemption = resp.redemption;

      if (evmSdk.skipRedemption) {
        saveRedemption({
          ...redemption,
          display: parseRedemptionDisplay(txParams),
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
