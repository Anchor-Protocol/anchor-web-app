import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import {
  Collateral,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEventHandler } from './useTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

export function useWithdrawCollateralTx():
  | StreamReturn<WithdrawCollateralTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawCollateralTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<WithdrawCollateralTxProps>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      await xAnchor.approveLimit(
        'bluna',
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId!, 'withdraw'),
          );
          handleEvent(event, txParams);
        },
      );

      return xAnchor.unlockCollateral(
        txParams.collateral,
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'withdraw'),
          );
          handleEvent(event, txParams);
        },
      );
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const withdrawTxStream = useRedeemableTx(
    withdrawTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'unlockCollateral',
      amount: `${formatOutput(txParams.amount as UST)} UST`,
    }),
  );

  return chainId && connection && address ? withdrawTxStream : [null, null];
}
