import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { TxEventHandler } from './useTx';
import { Native } from '@anchor-protocol/types';

type RedeemCollateralTxResult = TwoWayTxResponse<ContractReceipt> | null;
type RedeemCollateralTxRender = TxResultRendering<RedeemCollateralTxResult>;

export interface RedeemCollateralTxParams {
  collateralContractEvm: string;
  collateralContractTerra: string;
  amount: string;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useRedeemCollateralTx():
  | PersistedTxResult<RedeemCollateralTxParams, RedeemCollateralTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    native: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const redeemTx = useCallback(
    async (
      txParams: RedeemCollateralTxParams,
      renderTxResults: Subject<RedeemCollateralTxRender>,
      handleEvent: TxEventHandler<RedeemCollateralTxParams>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      return xAnchor.unlockCollateral(
        { contract: txParams.collateralContractTerra },
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'unlock collateral'),
          );
          handleEvent(event, txParams);
        },
      );
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const persistedTxResult = usePersistedTx<
    RedeemCollateralTxParams,
    RedeemCollateralTxResult
  >(
    redeemTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'unlockCollateral',
      amount: `${formatOutput(txParams.amount as Native)} ${
        (txParams.tokenDisplay && txParams.tokenDisplay.symbol) ?? 'UST'
      }`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
