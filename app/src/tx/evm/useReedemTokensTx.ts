import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { useCallback } from 'react';
import { ContractReceipt } from '@ethersproject/contracts';
import { Redemption } from '@anchor-protocol/crossanchor-sdk';
import { useRedemptions } from './storage';

type TxResult = ContractReceipt | null;
type TxRender = TxResultRendering<TxResult>;

export interface RedeemTokensTxProps {}

export function useRedeemTokensTx(
  redemption?: Redemption,
): StreamReturn<RedeemTokensTxProps, TxRender> | [null, null] {
  const { connection } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const { removeRedemption } = useRedemptions();

  const redeemTx = useCallback(async () => {
    try {
      const result = await xAnchor.redeemTokens(redemption!.outgoingSequence);
      removeRedemption(redemption!.outgoingSequence);
      return result;
    } catch (error: any) {
      if (error.data.message.includes('transfer info already processed')) {
        removeRedemption(redemption!.outgoingSequence);
      }
      throw error;
    }
  }, [xAnchor, redemption, removeRedemption]);

  const redeemTxStream = useTx(redeemTx, (resp) => resp, null);

  return connection && redemption ? redeemTxStream : [null, null];
}
