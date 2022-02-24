import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxRender>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const withdrawTx = useCallback(
    (txParams: WithdrawUstTxProps, renderTxResults: Subject<TxRender>) => {
      return ethSdk.redeemStable(
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
    [ethSdk, address, connectType],
  );

  const withdrawTxStream = useTx(withdrawTx, (resp) => resp.tx, null);

  return connection && address ? withdrawTxStream : [null, null];
}
