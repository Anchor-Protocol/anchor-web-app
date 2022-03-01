import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { useCallback } from 'react';
import { ContractReceipt } from '@ethersproject/contracts';
import { Redemption } from '@anchor-protocol/crossanchor-sdk';

type TxResult = ContractReceipt | null;
type TxRender = TxResultRendering<TxResult>;

export interface RedeemTokensTxProps {}

export function useRedeemTokensTx(
  redemption?: Redemption,
): StreamReturn<RedeemTokensTxProps, TxRender> | [null, null] {
  const { connection } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  const redeemTx = useCallback(() => {
    return evmSdk.redeemTokens(redemption!.outgoingSequence);
  }, [evmSdk, redemption]);

  const redeemTxStream = useTx(redeemTx, (resp) => resp, null);

  return connection && redemption ? redeemTxStream : [null, null];
}
