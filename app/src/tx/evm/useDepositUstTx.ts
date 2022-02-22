import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';

export interface DepositUstTxProps {
  depositAmount: string;
}

export function useDepositUstTx():
  | StreamReturn<DepositUstTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const depositTx = useCallback(
    (
      txParams: DepositUstTxProps,
      renderTxResults: Subject<TxResultRendering>,
    ) => {
      return ethSdk.depositStable(
        ethSdk.ustContract.address,
        toWei(txParams.depositAmount),
        address!,
        2100000,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(txResult(event, connectType));
        },
      );
    },
    [address, connectType, ethSdk],
  );

  const depositTxStream = useTx(depositTx);

  return connection && address ? depositTxStream : [null, null];
}
