import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { useCallback } from 'react';
import { RedemptionPayload } from '@anchor-protocol/crossanchor-sdk/lib/esm/crossanchor/base/wormhole';
import { ContractReceipt } from '@ethersproject/contracts';

type TxResult = ContractReceipt | null;
type TxRender = TxResultRendering<TxResult>;

export interface RedeemTokensTxProps {}

export function useRedeemTokensTx(
  redemptionPayload?: RedemptionPayload,
): StreamReturn<RedeemTokensTxProps, TxRender> | [null, null] {
  const { provider, connection } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const redeemTx = useCallback(() => {
    return ethSdk.redeemTokens(redemptionPayload!);
  }, [ethSdk, redemptionPayload]);

  const redeemTxStream = useTx(redeemTx, (resp) => resp, null);

  return connection && redemptionPayload ? redeemTxStream : [null, null];
}
