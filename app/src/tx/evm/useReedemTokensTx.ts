import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { useCallback } from 'react';
import { ContractReceipt } from '@ethersproject/contracts';
import { RedemptionPayload } from '@anchor-protocol/crossanchor-sdk';

type TxResult = ContractReceipt | null;
type TxRender = TxResultRendering<TxResult>;

export interface RedeemTokensTxProps {}

export function useRedeemTokensTx(
  redemptionPayload?: RedemptionPayload,
): StreamReturn<RedeemTokensTxProps, TxRender> | [null, null] {
  const { provider, connection } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk('testnet', provider);

  const redeemTx = useCallback(() => {
    return evmSdk.redeemTokens(redemptionPayload!);
  }, [evmSdk, redemptionPayload]);

  const redeemTxStream = useTx(redeemTx, (resp) => resp, null);

  return connection && redemptionPayload ? redeemTxStream : [null, null];
}
