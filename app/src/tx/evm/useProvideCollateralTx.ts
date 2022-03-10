import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { formatOutput, microfy, demicrofy } from '@anchor-protocol/formatter';
import { TxEvent } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { ANCHOR_TX_KEY } from '@anchor-protocol/app-provider';

type ProvideCollateralTxResult = OneWayTxResponse<ContractReceipt> | null;
type ProvideCollateralTxRender = TxResultRendering<ProvideCollateralTxResult>;

export interface ProvideCollateralTxParams {
  collateralContract: string;
  amount: bAsset & NoMicro;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useProvideCollateralTx(
  erc20Decimals: number,
):
  | BackgroundTxResult<ProvideCollateralTxParams, ProvideCollateralTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries();

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxParams,
      renderTxResults: Subject<ProvideCollateralTxRender>,
      txEvents: Subject<TxEvent<ProvideCollateralTxParams>>,
    ) => {
      try {
        const amount = microfy(txParams.amount, erc20Decimals).toString();

        await xAnchor.approveLimit(
          { contract: txParams.collateralContract },
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            renderTxResults.next(
              txResult(event, connectType, chainId!, 'lock collateral'),
            );
            txEvents.next({ event, txParams });
          },
        );

        const response = xAnchor.lockCollateral(
          { contract: txParams.collateralContract },
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            console.log(event, 'eventEmitted');

            renderTxResults.next(
              txResult(event, connectType, chainId!, 'lock collateral'),
            );
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(ANCHOR_TX_KEY.BORROW_PROVIDE_COLLATERAL);

        return response;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    [xAnchor, address, connectType, chainId, erc20Decimals, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    ProvideCollateralTxParams,
    ProvideCollateralTxResult
  >(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => {
      const { amount, tokenDisplay } = txParams;

      const decimals = tokenDisplay?.decimals ?? 6;
      const symbol = tokenDisplay?.symbol ?? 'UST';

      return {
        action: 'lockCollateral',
        amount: `${formatOutput(demicrofy(amount, decimals), {
          decimals,
        })} ${symbol}`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}