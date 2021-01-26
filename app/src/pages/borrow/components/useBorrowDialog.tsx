import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUST,
  formatUSTInput,
  Ratio,
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
  uUST,
} from '@anchor-protocol/notation';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useMarketNotNullable } from 'pages/borrow/context/market';
import { borrowAmountToLtv } from 'pages/borrow/logics/borrowAmountToLtv';
import { ltvToBorrowAmount } from 'pages/borrow/logics/ltvToBorrowAmount';
import { useAPR } from 'pages/borrow/logics/useAPR';
import { useBorrowMax } from 'pages/borrow/logics/useBorrowMax';
import { useBorrowNextLtv } from 'pages/borrow/logics/useBorrowNextLtv';
import { useBorrowReceiveAmount } from 'pages/borrow/logics/useBorrowReceiveAmount';
import { useBorrowSafeMax } from 'pages/borrow/logics/useBorrowSafeMax';
import { useBorrowTxFee } from 'pages/borrow/logics/useBorrowTxFee';
import { useCurrentLtv } from 'pages/borrow/logics/useCurrentLtv';
import { useInvalidBorrowAmount } from 'pages/borrow/logics/useInvalidBorrowAmount';
import { borrowOptions } from 'pages/borrow/transactions/borrowOptions';
import type { ReactNode } from 'react';
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
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { marketUserOverview, marketOverview } = useMarketNotNullable();

  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [borrow, borrowResult] = useOperation(borrowOptions, {
    addressProvider,
    post,
    client,
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
        marketUserOverview.loanAmount.loan_amount,
        marketUserOverview.borrowInfo.balance,
        marketUserOverview.borrowInfo.spendable,
        marketOverview.oraclePrice.rate,
      ),
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useMemo(
    () =>
      ltvToBorrowAmount(
        marketUserOverview.loanAmount.loan_amount,
        marketUserOverview.borrowInfo.balance,
        marketUserOverview.borrowInfo.spendable,
        marketOverview.oraclePrice.rate,
      ),
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useCurrentLtv(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
  );
  const nextLtv = useBorrowNextLtv(borrowAmount, currentLtv, amountToLtv);
  const apr = useAPR(marketOverview.borrowRate.rate);
  const safeMax = useBorrowSafeMax(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
    marketOverview.bLunaSafeLtv,
    currentLtv,
  );
  const max = useBorrowMax(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
    marketOverview.bLunaMaxLtv,
  );
  const txFee = useBorrowTxFee(borrowAmount, bank);
  const receiveAmount = useBorrowReceiveAmount(borrowAmount, txFee);

  const invalidTxFee = useInvalidTxFee(bank);
  const invalidBorrowAmount = useInvalidBorrowAmount(borrowAmount, bank, max);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBorrowAmount = useCallback((nextBorrowAmount: string) => {
    setBorrowAmount(nextBorrowAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletStatus,
      borrowAmount: UST,
      txFee: uUST<BigSource> | undefined,
    ) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await borrow({
        address: status.walletAddress,
        market: 'ust',
        amount: borrowAmount,
        withdrawTo: undefined,
        txFee: txFee!.toString() as uUST,
      });
    },
    [bank.status, borrow],
  );

  const onLtvChange = useCallback(
    (nextLtv: Ratio<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateBorrowAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateBorrowAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Ratio<Big>): Ratio<Big> => {
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
          Borrow APR : {formatRatioToPercentage(apr)}%{' '}
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
          {title}
          <TransactionRenderer result={borrowResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {title}

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={borrowAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!invalidBorrowAmount}
          onChange={({ target }) => updateBorrowAmount(target.value)}
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
            maxLtv={marketOverview.bLunaMaxLtv}
            safeLtv={marketOverview.bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={marketOverview.bLunaMaxLtv}
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
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            borrowAmount.length === 0 ||
            big(borrowAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBorrowAmount
          }
          onClick={() => proceed(status, borrowAmount, txFee)}
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
