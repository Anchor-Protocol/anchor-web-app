import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  TX_GAS_LIMIT,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { CW20Addr, ERC20Addr, u, UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { CollateralAmount } from '@anchor-protocol/types';
import Big from 'big.js';

type BorrowUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type BorrowUstTxRender = TxResultRendering<BorrowUstTxResult>;

export interface BorrowUstTxParams {
  borrowAmount: u<UST>;
  collateralToken?: CW20Addr;
  collateralAmount?: u<CollateralAmount<Big>>;
  erc20ContractAddress?: ERC20Addr;
  erc20Symbol?: string;
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

  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const borrowTx = useCallback(
    async (
      txParams: BorrowUstTxParams,
      renderTxResults: Subject<BorrowUstTxRender>,
      txEvents: Subject<TxEvent<BorrowUstTxParams>>,
    ) => {
      const {
        borrowAmount,
        collateralToken,
        collateralAmount,
        erc20ContractAddress,
        erc20Symbol,
      } = txParams;

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.timer.start();

      try {
        if (
          collateralToken &&
          collateralAmount &&
          erc20ContractAddress &&
          erc20Symbol
        ) {
          writer.approveCollateral(erc20Symbol);

          await xAnchor.approveLimit(
            { contract: erc20ContractAddress },
            collateralAmount.toString(),
            address!,
            TX_GAS_LIMIT,
            (event) => {
              txEvents.next({ event, txParams });
            },
          );
        }

        writer.approveUST();

        await xAnchor.approveLimit(
          { token: 'ust' },
          borrowAmount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
          },
        );

        writer.borrowUST();
        writer.timer.reset();

        let result;

        if (
          collateralToken &&
          collateralAmount &&
          erc20ContractAddress &&
          erc20Symbol
        ) {
          // borrowing based on additional collateral being locked
          result = await xAnchor.lockAndBorrow(
            { contract: erc20ContractAddress },
            collateralAmount.toString(),
            borrowAmount,
            address!,
            TX_GAS_LIMIT,
            (event) => {
              //writer.provideAndBorrow(collateralSymbol, event);
              writer.borrowUST(event, erc20Symbol);
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

  const {
    ust: { demicrofy, formatOutput },
  } = useFormatters();

  const persistedTxResult = useBackgroundTx<
    BorrowUstTxParams,
    BorrowUstTxResult
  >(
    borrowTx,
    (resp) => resp.tokenTransfer,
    null,
    (txParams) => {
      return {
        txKind: TxKind.BorrowUst,
        amount: `${formatOutput(demicrofy(txParams.borrowAmount))} UST`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
