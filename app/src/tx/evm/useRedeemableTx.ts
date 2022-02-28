import { StreamReturn } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRedemptionStorage } from './storage/useRedemptionStorage';
import { useNavigate } from 'react-router-dom';
import { useEvmCrossAnchorSdk } from 'crossanchor';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export const useRedeemableTx = <TxParams>(
  sendTx: (
    txParams: TxParams,
    renderTxResults: Subject<TxRender>,
  ) => Promise<NonNullable<TxResult>>,
  parseTx: (txResult: NonNullable<TxResult>) => ContractReceipt,
  emptyTxResult: TxResult,
): StreamReturn<TxParams, TxRender> => {
  const evmSdk = useEvmCrossAnchorSdk();
  const { saveRedemption } = useRedemptionStorage();
  const navigate = useNavigate();

  return useTx(
    async (txParams: TxParams, renderTxResults: Subject<TxRender>) => {
      const resp = await sendTx(txParams, renderTxResults);

      if (evmSdk.skipRedemption) {
        const redemption = resp.redemption;
        saveRedemption(redemption);
        navigate(`/bridge/redeem/${redemption.outgoingSequence}`);
      }

      return resp;
    },
    parseTx,
    emptyTxResult,
  );
};
