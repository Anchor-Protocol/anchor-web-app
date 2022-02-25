import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxRender>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk('testnet', provider);

  const withdrawTx = useCallback(
    (txParams: WithdrawUstTxProps, renderTxResults: Subject<TxRender>) => {
      return evmSdk.redeemStable(
        toWei(txParams.withdrawAmount),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, 'ethereum', 'withdraw'),
          );
        },
      );
    },
    [evmSdk, address, connectType],
  );

  const withdrawTxStream = useRedeemableTx(withdrawTx, (resp) => resp.tx, null);

  return connection && address ? withdrawTxStream : [null, null];
}
