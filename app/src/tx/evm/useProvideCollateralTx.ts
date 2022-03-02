import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import {
  Collateral,
  CrossChainEventHandler,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;
export interface ProvideCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

// TODO: parametrize by collateral
export function useProvideCollateralTx():
  | StreamReturn<ProvideCollateralTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: CrossChainEventHandler,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      // TODO: approve correct collateral
      await xAnchor.approveLimit(
        'ust',
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId!, 'lock collateral'),
          );
          handleEvent(event);
        },
      );

      return xAnchor.lockCollateral(
        txParams.collateral,
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'lock collateral'),
          );
          handleEvent(event);
        },
      );
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const provideTxStream = useRedeemableTx(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'lockCollateral',
      amount: `${formatOutput(txParams.amount as UST)} UST`,
    }),
  );

  return chainId && connection && address ? provideTxStream : [null, null];
}
