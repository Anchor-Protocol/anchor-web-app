import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { formatOutput, microfy, demicrofy } from '@anchor-protocol/formatter';
import { TxEventHandler } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';

type RedeemCollateralTxResult = TwoWayTxResponse<ContractReceipt> | null;
type RedeemCollateralTxRender = TxResultRendering<RedeemCollateralTxResult>;

export interface RedeemCollateralTxParams {
  collateralContractEvm: string;
  collateralContractTerra: string;
  amount: bAsset & NoMicro;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useRedeemCollateralTx(
  erc20Decimals: number,
):
  | PersistedTxResult<RedeemCollateralTxParams, RedeemCollateralTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const redeemTx = useCallback(
    async (
      txParams: RedeemCollateralTxParams,
      renderTxResults: Subject<RedeemCollateralTxRender>,
      handleEvent: TxEventHandler<RedeemCollateralTxParams>,
    ) => {
      const amount = microfy(txParams.amount, erc20Decimals).toString();

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
    [xAnchor, address, connectType, chainId, erc20Decimals],
  );

  const persistedTxResult = usePersistedTx<
    RedeemCollateralTxParams,
    RedeemCollateralTxResult
  >(
    redeemTx,
    (resp) => resp.tx,
    null,
    (txParams) => {
      const { amount, tokenDisplay } = txParams;

      const decimals = tokenDisplay?.decimals ?? 6;
      const symbol = tokenDisplay?.symbol ?? 'UST';

      return {
        action: 'unlockCollateral',
        amount: `${formatOutput(demicrofy(amount, decimals), {
          decimals,
        })} ${symbol}`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
