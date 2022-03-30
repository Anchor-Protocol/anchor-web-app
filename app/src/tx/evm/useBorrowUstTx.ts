import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  TX_GAS_LIMIT,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { EvmChainId, TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { ERC20Addr, u, UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { CollateralAmount } from '@anchor-protocol/types';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';

type BorrowUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type BorrowUstTxRender = TxResultRendering<BorrowUstTxResult>;

export interface BorrowUstTxParams {
  borrowAmount: u<UST>;
  collateral?: WhitelistCollateral;
  collateralAmount?: u<CollateralAmount<Big>>;
}

export function useBorrowUstTx():
  | BackgroundTxResult<BorrowUstTxParams, BorrowUstTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const {
    ust: { formatOutput, demicrofy },
  } = useFormatters();

  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const borrowTx = useCallback(
    async (
      txParams: BorrowUstTxParams,
      renderTxResults: Subject<BorrowUstTxRender>,
      txEvents: Subject<TxEvent<BorrowUstTxParams>>,
    ) => {
      const { borrowAmount, collateral, collateralAmount } = txParams;

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.timer.start();

      try {
        if (collateral && collateralAmount) {
          writer.approveCollateral(collateral.symbol);

          await xAnchor.approveLimit(
            { contract: collateral.bridgedAddress as ERC20Addr },
            collateralAmount.toString(),
            address!,
            TX_GAS_LIMIT,
          );
        }

        writer.approveUST();

        await xAnchor.approveLimit(
          { token: 'UST' },
          borrowAmount,
          address!,
          TX_GAS_LIMIT,
        );

        writer.borrowUST();
        writer.timer.reset();

        let result;

        if (collateral && collateralAmount) {
          // borrowing based on additional collateral being locked
          result = await xAnchor.lockAndBorrow(
            { contract: collateral.bridgedAddress as ERC20Addr },
            collateralAmount.toString(),
            borrowAmount,
            address!,
            TX_GAS_LIMIT,
            (event) => {
              writer.borrowUST(event, collateral.symbol);
              txEvents.next({ event, txParams });
            },
          );

          refetchQueries(refetchQueryByTxKind(TxKind.BorrowUst));
          refetchQueries(refetchQueryByTxKind(TxKind.ProvideCollateral));
        } else {
          // just borrowing based on current collateral
          result = await xAnchor.borrowStable(
            borrowAmount,
            address!,
            TX_GAS_LIMIT,
            (event) => {
              writer.borrowUST(event);
              txEvents.next({ event, txParams });
            },
          );
          refetchQueries(refetchQueryByTxKind(TxKind.BorrowUst));
        }

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectType, xAnchor, chainId, refetchQueries],
  );

  const displayTx = useCallback(
    (txParams: BorrowUstTxParams) => ({
      txKind: TxKind.BorrowUst,
      amount: `${formatOutput(demicrofy(txParams.borrowAmount))} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput, demicrofy],
  );

  const persistedTxResult = useBackgroundTx<
    BorrowUstTxParams,
    BorrowUstTxResult
  >(borrowTx, parseTx, null, displayTx);

  return chainId && connection && address ? persistedTxResult : undefined;
}

const parseTx = (resp: NonNullable<BorrowUstTxResult>) => resp.tx;
