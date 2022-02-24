import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import {
  Collateral,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

export function useWithdrawCollateralTx():
  | StreamReturn<WithdrawCollateralTxProps, TxRender>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const withdrawTx = useCallback(
    (
      txParams: WithdrawCollateralTxProps,
      renderTxResults: Subject<TxRender>,
    ) => {
      return ethSdk.unlockCollateral(
        txParams.collateral,
        toWei(txParams.amount),
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
