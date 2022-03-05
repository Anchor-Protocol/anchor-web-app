import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { TxEventHandler } from './useTx';
import { Native } from '@anchor-protocol/types';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;
export interface ProvideCollateralTxProps {
  collateralContract: string;
  amount: string;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useProvideCollateralTx():
  | StreamReturn<ProvideCollateralTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    native: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<ProvideCollateralTxProps>,
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

  const provideTxStream = useRedeemableTx(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'lockCollateral',
      amount: `${formatOutput(txParams.amount as Native)} ${
        (txParams.tokenDisplay && txParams.tokenDisplay.symbol) ?? 'UST'
      }`,
    }),
  );

  return chainId && connection && address ? provideTxStream : [null, null];
}
