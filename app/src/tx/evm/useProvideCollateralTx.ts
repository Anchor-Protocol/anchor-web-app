import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { TxEventHandler } from './useTx';
import { Native } from '@anchor-protocol/types';

type ProvideCollateralTxResult = OneWayTxResponse<ContractReceipt> | null;
type ProvideCollateralTxRender = TxResultRendering<ProvideCollateralTxResult>;

export interface ProvideCollateralTxParams {
  collateralContract: string;
  amount: string;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useProvideCollateralTx():
  | PersistedTxResult<ProvideCollateralTxParams, ProvideCollateralTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    native: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxParams,
      renderTxResults: Subject<ProvideCollateralTxRender>,
      handleEvent: TxEventHandler<ProvideCollateralTxParams>,
    ) => {
      try {
        console.log('txParams.amount', txParams.amount);
        console.log(
          'txParams.amountInput',
          microfy(formatInput(txParams.amount)).toString(),
        );

        const amount = microfy(formatInput(txParams.amount)).toString();

        await xAnchor.approveLimit(
          { contract: txParams.collateralContract },
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            renderTxResults.next(
              txResult(event, connectType, chainId!, 'lock collateral'),
            );
            handleEvent(event, txParams);
          },
        );

        return xAnchor.lockCollateral(
          { contract: txParams.collateralContract },
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            console.log(event, 'eventEmitted');

            renderTxResults.next(
              txResult(event, connectType, chainId!, 'lock collateral'),
            );
            handleEvent(event, txParams);
          },
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const persistedTxResult = usePersistedTx<
    ProvideCollateralTxParams,
    ProvideCollateralTxResult
  >(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'lockCollateral',
      amount: `${formatOutput(txParams.amount as Native)} ${
        (txParams.tokenDisplay && txParams.tokenDisplay.symbol) ?? 'UST'
      }`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
