import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { Collateral } from '@crossanchor/sdk';

export interface ProvideCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

export function useProvideCollateralTx():
  | StreamReturn<ProvideCollateralTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const provideTx = useCallback(
    (
      txParams: ProvideCollateralTxProps,
      renderTxResults: Subject<TxResultRendering>,
    ) => {
      return ethSdk.lockCollateral(
        txParams.collateral,
        toWei(txParams.amount),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(txResult(event, connectType));
        },
      );
    },
    [ethSdk, address, connectType],
  );

  const provideTxStream = useTx(provideTx);

  return connection && address ? provideTxStream : [null, null];
}
