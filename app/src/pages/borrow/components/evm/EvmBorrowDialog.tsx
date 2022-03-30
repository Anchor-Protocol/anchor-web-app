import React, { useEffect } from 'react';
import { CollateralAmount, ERC20Addr, u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/evm';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { microfy, useFormatters } from '@anchor-protocol/formatter';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';
import { useBorrowBorrowForm } from '@anchor-protocol/app-provider';
import { useERC20TokenQuery } from '@libs/app-provider';
import '@extensions/crossanchor';

export const EvmBorrowDialog = (
  props: DialogProps<Omit<BorrowFormParams, 'input' | 'states'>>,
) => {
  const { fallbackBorrowMarket, fallbackBorrowBorrower } = props;

  const sdk = useEvmCrossAnchorSdk();

  const { connected, nativeWalletAddress } = useAccount();

  const { ust } = useFormatters();

  const [input, states] = useBorrowBorrowForm(
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const borrowUstTx = useBorrowUstTx();
  const { isTxMinimizable, minimize } = borrowUstTx?.utils ?? {};
  const [postBorrowUstTx, borrowUstTxResult] = borrowUstTx?.stream ?? [
    null,
    null,
  ];

  const { data: erc20Token } = useERC20TokenQuery(
    states.collateral?.bridgedAddress as ERC20Addr | undefined,
  );

  useEffect(() => {
    input({
      collateralAmount: Big(0) as u<CollateralAmount<Big>>,
      maxCollateralAmount: Big(0) as u<CollateralAmount<Big>>,
    });
    if (states.collateral && nativeWalletAddress) {
      sdk
        .fetchWalletBalance(nativeWalletAddress, states.collateral)
        .then((maxCollateralAmount) => {
          input({
            collateralAmount: Big(0) as u<CollateralAmount<Big>>,
            maxCollateralAmount,
          });
        });
    }
  }, [sdk, input, nativeWalletAddress, states.collateral]);

  const proceed = useCallback(
    (
      amount: UST,
      txFee: u<UST>,
      collateral?: WhitelistCollateral,
      collateralAmount?: u<CollateralAmount<Big>>,
    ) => {
      if (connected && postBorrowUstTx) {
        const borrowAmount = ust.microfy(ust.formatInput(amount));
        if (
          collateral &&
          collateralAmount &&
          collateralAmount.gt(0) &&
          erc20Token
        ) {
          postBorrowUstTx({
            borrowAmount,
            collateral,
            collateralAmount: collateralAmount
              ? (Big(microfy(Big(collateralAmount), erc20Token.decimals)) as u<
                  CollateralAmount<Big>
                >)
              : (Big(0) as u<CollateralAmount<Big>>),
          });
          return;
        }

        postBorrowUstTx({ borrowAmount });
      }
    },
    [postBorrowUstTx, connected, erc20Token, ust],
  );

  return (
    <BorrowDialog
      {...props}
      input={input}
      states={states}
      onCollateralChange={(collateral) => {
        input({ collateral });
      }}
      txResult={borrowUstTxResult}
      proceedable={postBorrowUstTx !== undefined}
      onProceed={proceed}
      renderTxResult={({ txResult, closeDialog }) => (
        <TxResultRenderer
          onExit={closeDialog}
          resultRendering={txResult.value}
          minimizable={isTxMinimizable}
          onMinimize={minimize}
        />
      )}
    />
  );
};
