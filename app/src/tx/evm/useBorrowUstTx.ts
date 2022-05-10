import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
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
import { microfy } from '@anchor-protocol/formatter';

type BorrowUstTxResult = ContractReceipt | null;
type BorrowUstTxRender = TxResultRendering<BorrowUstTxResult>;

export interface BorrowUstTxParams {
  borrowAmount: u<UST>;
  collateral?: WhitelistCollateral;
  collateralAmount?: u<CollateralAmount<Big>>;
}

export function useBorrowUstTx():
  | BackgroundTxResult<BorrowUstTxParams, BorrowUstTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const sdk = useEvmSdk();

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

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.timer.start();

      try {
        // if we have collateral then this is provided
        // along with the borrow in one operation
        if (collateral && collateralAmount && collateralAmount.gt(0)) {
          const erc20Token = await sdk.fetchERC20Token(collateral);

          writer.approveCollateral(erc20Token.symbol); // token symbol or collateral symbol?

          // need to normalize the amount according to the ERC20 definition
          const nativeCollateralAmount = microfy(
            Big(collateralAmount),
            erc20Token.decimals - collateral.decimals,
          );

          await sdk.approveLimit(
            address!,
            { contract: collateral.bridgedAddress as ERC20Addr },
            nativeCollateralAmount.toString(),
          );

          writer.borrowUST();
          writer.timer.reset();

          // borrowing based on additional collateral being locked
          const lockAndBorrowResult = await sdk.lockAndBorrow(
            address!,
            { contract: collateral.bridgedAddress as ERC20Addr },
            nativeCollateralAmount.toString(),
            borrowAmount,
            {
              handleEvent: (event) => {
                writer.borrowUST(event, collateral.symbol);
                txEvents.next({ event, txParams });
              },
            },
          );

          refetchQueries(refetchQueryByTxKind(TxKind.BorrowUst));
          refetchQueries(refetchQueryByTxKind(TxKind.ProvideCollateral));

          return lockAndBorrowResult;
        }

        // just borrowing based on current collateral
        const borrowResult = await sdk.borrowStable(address!, borrowAmount, {
          handleEvent: (event) => {
            writer.borrowUST(event);
            txEvents.next({ event, txParams });
          },
        });
        refetchQueries(refetchQueryByTxKind(TxKind.BorrowUst));

        return borrowResult;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, sdk, refetchQueries],
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

  return address ? persistedTxResult : undefined;
}

const parseTx = (resp: NonNullable<BorrowUstTxResult>) => resp;
