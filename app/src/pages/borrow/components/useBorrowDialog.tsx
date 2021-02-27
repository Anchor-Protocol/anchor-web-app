import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatRateToPercentage,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import type { DialogProps, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useMarketNotNullable } from 'pages/borrow/context/market';
import { apr as _apr } from 'pages/borrow/logics/apr';
import { borrowAmountToLtv } from 'pages/borrow/logics/borrowAmountToLtv';
import { borrowMax } from 'pages/borrow/logics/borrowMax';
import { borrowNextLtv } from 'pages/borrow/logics/borrowNextLtv';
import { borrowReceiveAmount } from 'pages/borrow/logics/borrowReceiveAmount';
import { borrowSafeMax } from 'pages/borrow/logics/borrowSafeMax';
import { borrowTxFee } from 'pages/borrow/logics/borrowTxFee';
import { currentLtv as _currentLtv } from 'pages/borrow/logics/currentLtv';
import { ltvToBorrowAmount } from 'pages/borrow/logics/ltvToBorrowAmount';
import { validateBorrowAmount } from 'pages/borrow/logics/validateBorrowAmount';
import { borrowOptions } from 'pages/borrow/transactions/borrowOptions';
import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useBorrowDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    loanAmount,
    borrowInfo,
    oraclePrice,
    bLunaMaxLtv,
    bLunaSafeLtv,
    borrowRate,
  } = useMarketNotNullable();

  const { status } = useWallet();

  const { serviceAvailable, walletReady } = useService();

  const { fixedGas, blocksPerYear } = useConstants();

  const [borrow, borrowResult] = useOperation(borrowOptions, {
    walletStatus: status,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [borrowAmount, setBorrowAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () =>
      borrowAmountToLtv(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
      ),
    [
      oraclePrice.rate,
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useMemo(
    () =>
      ltvToBorrowAmount(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
      ),
    [
      oraclePrice.rate,
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
    ],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useServiceConnectedMemo(
    () =>
      _currentLtv(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
      ),
    [
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
      oraclePrice.rate,
    ],
    undefined,
  );

  const nextLtv = useServiceConnectedMemo(
    () => borrowNextLtv(borrowAmount, currentLtv, amountToLtv),
    [amountToLtv, borrowAmount, currentLtv],
    undefined,
  );

  const apr = useServiceConnectedMemo(
    () => _apr(borrowRate.rate, blocksPerYear),
    [blocksPerYear, borrowRate.rate],
    big(0) as Rate<Big>,
  );

  const safeMax = useServiceConnectedMemo(
    () =>
      borrowSafeMax(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
        bLunaSafeLtv,
        currentLtv,
      ),
    [
      bLunaSafeLtv,
      borrowInfo.balance,
      borrowInfo.spendable,
      currentLtv,
      loanAmount.loan_amount,
      oraclePrice.rate,
    ],
    big(0) as uUST<Big>,
  );

  const max = useServiceConnectedMemo(
    () =>
      borrowMax(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
        bLunaMaxLtv,
      ),
    [
      bLunaMaxLtv,
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
      oraclePrice.rate,
    ],
    big(0) as uUST<Big>,
  );

  const txFee = useServiceConnectedMemo(
    () => borrowTxFee(borrowAmount, bank, fixedGas),
    [bank, borrowAmount, fixedGas],
    big(0) as uUST<Big>,
  );

  const receiveAmount = useServiceConnectedMemo(
    () => borrowReceiveAmount(borrowAmount, txFee),
    [borrowAmount, txFee],
    big(0) as uUST<Big>,
  );

  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidBorrowAmount = useServiceConnectedMemo(
    () => validateBorrowAmount(borrowAmount, max),
    [borrowAmount, max],
    undefined,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBorrowAmount = useCallback((nextBorrowAmount: string) => {
    setBorrowAmount(nextBorrowAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      borrowAmount: UST,
      txFee: uUST<BigSource> | undefined,
    ) => {
      await borrow({
        address: walletReady.walletAddress,
        market: 'ust',
        amount: borrowAmount,
        withdrawTo: undefined,
        txFee: txFee!.toString() as uUST,
      });
    },
    [borrow],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateBorrowAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateBorrowAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Rate<Big>): Rate<Big> => {
      try {
        const draftAmount = ltvToAmount(draftLtv);
        return amountToLtv(draftAmount);
      } catch {
        return draftLtv;
      }
    },
    [ltvToAmount, amountToLtv],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const title = (
    <h1>
      Borrow{' '}
      <p>
        <IconSpan>
          Borrow APR : {formatRateToPercentage(apr)}%{' '}
          <InfoTooltip>
            Current rate of annualized borrowing interest applied for this
            stablecoin
          </InfoTooltip>
        </IconSpan>
      </p>
    </h1>
  );

  if (
    borrowResult?.status === 'in-progress' ||
    borrowResult?.status === 'done' ||
    borrowResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={borrowResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {title}

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={borrowAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!invalidBorrowAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBorrowAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidBorrowAmount}>
          <span>{invalidBorrowAmount}</span>
          <span>
            Safe Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateBorrowAmount(formatUSTInput(demicrofy(safeMax)))
              }
            >
              {formatUST(demicrofy(safeMax))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!serviceAvailable || max.lte(0)}
            maxLtv={bLunaMaxLtv}
            safeLtv={bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={bLunaMaxLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {txFee && receiveAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(receiveAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            !serviceAvailable ||
            borrowAmount.length === 0 ||
            big(borrowAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBorrowAmount
          }
          onClick={() =>
            walletReady && proceed(walletReady, borrowAmount, txFee)
          }
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    p {
      color: ${({ theme }) => theme.positiveTextColor};
      font-size: 14px;
      margin-top: 10px;
    }

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: #f5356a;
    }

    margin-bottom: 45px;
  }

  .graph {
    margin-bottom: 40px;
  }

  .receipt {
    margin-bottom: 30px;
  }

  .proceed {
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
