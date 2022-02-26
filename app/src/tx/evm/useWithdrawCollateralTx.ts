import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import {
  Collateral,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useRedeemableTx } from './useRedeemableTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

export function useWithdrawCollateralTx():
  | StreamReturn<WithdrawCollateralTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  const withdrawTx = useCallback(
    (
      txParams: WithdrawCollateralTxProps,
      renderTxResults: Subject<TxRender>,
    ) => {
      return evmSdk.unlockCollateral(
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
    [evmSdk, address, connectType],
  );

  const withdrawTxStream = useRedeemableTx(withdrawTx, (resp) => resp.tx, null);

  return connection && address ? withdrawTxStream : [null, null];
}
