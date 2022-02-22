import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const withdrawTx = useCallback(
    (
      txParams: WithdrawUstTxProps,
      renderTxResults: Subject<TxResultRendering>,
    ) => {
      return ethSdk.redeemStable(
        ethSdk.ustContract.address,
        toWei(txParams.withdrawAmount),
        address!,
        2100000,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(txResult(event, connectType));
        },
      );
    },
    [ethSdk, address, connectType],
  );

  const withdrawTxStream = useTx(withdrawTx);

  return connection && address ? withdrawTxStream : [null, null];
}
