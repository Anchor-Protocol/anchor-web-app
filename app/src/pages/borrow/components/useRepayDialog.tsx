import {
  demicrofy,
  formatRate,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, UST } from '@anchor-protocol/types';
import {
  BorrowBorrowerData,
  BorrowMarketData,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useBorrowRepayTx,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'base/contexts/bank';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { apr as _apr } from '../logics/apr';
import { currentLtv as _currentLtv } from '../logics/currentLtv';
import { ltvToRepayAmount } from '../logics/ltvToRepayAmount';
import { repayAmountToLtv } from '../logics/repayAmountToLtv';
import { repayNextLtv } from '../logics/repayNextLtv';
import { repaySendAmount } from '../logics/repaySendAmount';
import { repayTotalBorrows } from '../logics/repayTotalBorrows';
import { repayTotalOutstandingLoan } from '../logics/repayTotalOutstandingLoan';
import { repayTxFee } from '../logics/repayTxFee';
import { validateRepayAmount } from '../logics/validateRepayAmount';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  fallbackBorrowMarket: BorrowMarketData;
  fallbackBorrowBorrower: BorrowBorrowerData;
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
  fallbackBorrowMarket,
  fallbackBorrowBorrower,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas, blocksPerYear },
  } = useAnchorWebapp();

  const [repay, repayResult] = useBorrowRepayTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [repayAmount, setRepayAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: {
      borrowRate,
      oraclePrice,
      bLunaMaxLtv = '0.5' as Rate,
      bLunaSafeLtv = '0.3' as Rate,
      marketState,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo: loanAmount,
      custodyBorrower: borrowInfo,
      blockHeight,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () => repayAmountToLtv(loanAmount, borrowInfo, oraclePrice),
    [loanAmount, borrowInfo, oraclePrice],
  );

  const ltvToAmount = useMemo(
    () => ltvToRepayAmount(loanAmount, borrowInfo, oraclePrice),
    [loanAmount, borrowInfo, oraclePrice],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const currentLtv = useMemo(
    () => _currentLtv(loanAmount, borrowInfo, oraclePrice),
    [borrowInfo, loanAmount, oraclePrice],
  );

  const nextLtv = useMemo(
    () => repayNextLtv(repayAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, repayAmount],
  );

  const apr = useMemo(() => _apr(borrowRate, blocksPerYear), [
    blocksPerYear,
    borrowRate,
  ]);

  const totalBorrows = useMemo(
    () => repayTotalBorrows(marketState, borrowRate, loanAmount, blockHeight),
    [borrowRate, blockHeight, loanAmount, marketState],
  );

  const txFee = useMemo(() => repayTxFee(repayAmount, bank, fixedGas), [
    bank,
    fixedGas,
    repayAmount,
  ]);

  const totalOutstandingLoan = useMemo(
    () => repayTotalOutstandingLoan(repayAmount, loanAmount),
    [loanAmount, repayAmount],
  );

  const sendAmount = useMemo(() => repaySendAmount(repayAmount, txFee), [
    repayAmount,
    txFee,
  ]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidAssetAmount = useMemo(
    () => validateRepayAmount(repayAmount, bank),
    [bank, repayAmount],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRepayAmount = useCallback((nextRepayAmount: string) => {
    setRepayAmount(nextRepayAmount as UST);
  }, []);

  const proceed = useCallback(
    (repayAmount: UST) => {
      if (!connectedWallet || !repay) {
        return;
      }

      repay({ repayAmount });
    },
    [connectedWallet, repay],
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
          Borrow APR : {formatRate(apr)}%{' '}
          <InfoTooltip>
            Current rate of annualized borrowing interest applied for this
            stablecoin
          </InfoTooltip>
        </IconSpan>
      </p>
    </h1>
  );

  if (
    repayResult?.status === StreamStatus.IN_PROGRESS ||
    repayResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={repayResult.value}
            onExit={closeDialog}
          />
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
            disabled={!connectedWallet}
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
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
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
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !repay ||
            repayAmount.length === 0 ||
            big(repayAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAssetAmount
          }
          onClick={() => proceed(repayAmount)}
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
      color: ${({ theme }) => theme.colors.positive};
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
      color: ${({ theme }) => theme.colors.negative};
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
