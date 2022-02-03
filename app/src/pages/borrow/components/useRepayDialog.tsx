import { BorrowBorrower } from '@anchor-protocol/app-fns';
import {
  BorrowMarketWithDisplay,
  useBorrowRepayForm,
  useBorrowRepayTx,
} from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { EstimatedLiquidationPrice } from './EstimatedLiquidationPrice';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
  fallbackBorrowBorrower: BorrowBorrower;
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

  const [postTx, txResult] = useBorrowRepayTx();

  const [input, states] = useBorrowRepayForm(
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRepayAmount = useCallback(
    (nextRepayAmount: string) => {
      input({ repayAmount: nextRepayAmount as UST });
    },
    [input],
  );

  const proceed = useCallback(
    (repayAmount: UST, txFee: u<UST>) => {
      if (!connectedWallet || !postTx) {
        return;
      }

      postTx({ repayAmount, txFee });
    },
    [connectedWallet, postTx],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({
          repayAmount: formatUSTInput(demicrofy(nextAmount)),
        });
      } catch {}
    },
    [input, states.ltvToAmount],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const title = (
    <h1>
      Repay{' '}
      <p>
        <IconSpan>
          Borrow APR : {formatRate(states.apr)}%{' '}
          <InfoTooltip>
            Current rate of annualized borrowing interest applied for this
            stablecoin
          </InfoTooltip>
        </IconSpan>
      </p>
    </h1>
  );

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={txResult.value}
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

        {!!states.invalidTxFee && (
          <MessageBox>{states.invalidTxFee}</MessageBox>
        )}

        <NumberInput
          className="amount"
          value={states.repayAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REPAY AMOUNT"
          error={!!states.invalidRepayAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRepayAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!states.invalidRepayAmount}>
          <span>{states.invalidRepayAmount}</span>
          <span>
            Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateRepayAmount(
                  formatUSTInput(demicrofy(states.maxRepayingAmount)),
                )
              }
            >
              {formatUST(demicrofy(states.maxRepayingAmount))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!connectedWallet}
            borrowLimit={states.borrowLimit}
            start={0}
            end={states.currentLtv?.toNumber() ?? 0}
            value={states.nextLtv}
            onChange={onLtvChange}
            onStep={states.ltvStepFunction}
          />
        </figure>

        {states.nextLtv?.lt(states.currentLtv ?? 0) && (
          <EstimatedLiquidationPrice>
            {states.estimatedLiquidationPrice}
          </EstimatedLiquidationPrice>
        )}

        {states.totalOutstandingLoan && states.txFee && states.sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Total Outstanding Loan">
              {states.totalOutstandingLoan.lt(0)
                ? 0
                : formatUST(demicrofy(states.totalOutstandingLoan))}{' '}
              UST
            </TxFeeListItem>
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(states.txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(states.sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !postTx ||
              !states.availablePost
            }
            onClick={() =>
              states.txFee &&
              proceed(states.repayAmount, states.txFee.toFixed() as u<UST>)
            }
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
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
    margin-top: 70px;
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
