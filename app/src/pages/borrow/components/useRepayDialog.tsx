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
import { currentLtv as _currentLtv } from 'pages/borrow/logics/currentLtv';
import { ltvToRepayAmount } from 'pages/borrow/logics/ltvToRepayAmount';
import { repayAmountToLtv } from 'pages/borrow/logics/repayAmountToLtv';
import { repayNextLtv } from 'pages/borrow/logics/repayNextLtv';
import { repaySendAmount } from 'pages/borrow/logics/repaySendAmount';
import { repayTotalBorrows } from 'pages/borrow/logics/repayTotalBorrows';
import { repayTotalOutstandingLoan } from 'pages/borrow/logics/repayTotalOutstandingLoan';
import { repayTxFee } from 'pages/borrow/logics/repayTxFee';
import { validateRepayAmount } from 'pages/borrow/logics/validateRepayAmount';
import { repayOptions } from 'pages/borrow/transactions/repayOptions';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useRepayDialog(): [
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
    bLunaMaxLtv,
    bLunaSafeLtv,
    oraclePrice,
    borrowRate,
    currentBlock,
    marketState,
  } = useMarketNotNullable();

  const { status } = useWallet();

  const { serviceAvailable, walletReady } = useService();

  const { fixedGas, blocksPerYear } = useConstants();

  const [repay, repayResult] = useOperation(repayOptions, {
    walletStatus: status,
  });

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [repayAmount, setRepayAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () =>
      repayAmountToLtv(
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
      ltvToRepayAmount(
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
  // compute
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
    () => repayNextLtv(repayAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, repayAmount],
    undefined,
  );

  const apr = useServiceConnectedMemo(
    () => _apr(borrowRate.rate, blocksPerYear),
    [blocksPerYear, borrowRate.rate],
    big(0) as Rate<Big>,
  );

  const totalBorrows = useServiceConnectedMemo(
    () =>
      repayTotalBorrows(
        loanAmount.loan_amount,
        borrowRate.rate,
        currentBlock,
        marketState.last_interest_updated,
        marketState.global_interest_index,
        loanAmount.interest_index,
      ),
    [
      borrowRate.rate,
      currentBlock,
      loanAmount.interest_index,
      loanAmount.loan_amount,
      marketState.global_interest_index,
      marketState.last_interest_updated,
    ],
    big(0) as uUST<Big>,
  );

  const txFee = useServiceConnectedMemo(
    () => repayTxFee(repayAmount, bank, fixedGas),
    [bank, fixedGas, repayAmount],
    undefined,
  );

  const totalOutstandingLoan = useServiceConnectedMemo(
    () => repayTotalOutstandingLoan(repayAmount, loanAmount.loan_amount),
    [loanAmount.loan_amount, repayAmount],
    undefined,
  );

  const sendAmount = useServiceConnectedMemo(
    () => repaySendAmount(repayAmount, txFee),
    [repayAmount, txFee],
    undefined,
  );

  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidAssetAmount = useServiceConnectedMemo(
    () => validateRepayAmount(repayAmount, bank),
    [bank, repayAmount],
    undefined,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRepayAmount = useCallback((nextRepayAmount: string) => {
    setRepayAmount(nextRepayAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      repayAmount: UST,
      txFee: uUST<BigSource> | undefined,
    ) => {
      await repay({
        address: walletReady.walletAddress,
        market: 'ust',
        amount: repayAmount,
        borrower: undefined,
        txFee: txFee!.toString() as uUST,
      });
    },
    [repay],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateRepayAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateRepayAmount],
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
      Repay{' '}
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
    repayResult?.status === 'in-progress' ||
    repayResult?.status === 'done' ||
    repayResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={repayResult} onExit={closeDialog} />
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
          value={repayAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REPAY AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRepayAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAssetAmount}>
          <span>{invalidAssetAmount}</span>
          <span>
            Total Borrowed:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateRepayAmount(formatUSTInput(demicrofy(totalBorrows)))
              }
            >
              {formatUST(demicrofy(totalBorrows))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!serviceAvailable}
            maxLtv={bLunaMaxLtv}
            safeLtv={bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={0 as Rate<BigSource>}
            userMaxLtv={currentLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {totalOutstandingLoan && txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Total Outstanding Loan">
              {totalOutstandingLoan.lt(0)
                ? 0
                : formatUST(demicrofy(totalOutstandingLoan))}{' '}
              UST
            </TxFeeListItem>
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            !serviceAvailable ||
            repayAmount.length === 0 ||
            big(repayAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAssetAmount
          }
          onClick={() =>
            walletReady && proceed(walletReady, repayAmount, txFee)
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

  .limit {
    width: 100%;
    margin-bottom: 30px;
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
