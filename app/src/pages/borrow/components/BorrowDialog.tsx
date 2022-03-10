import {
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
} from '@anchor-protocol/app-fns';
import { useBorrowBorrowForm } from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import { TxResultRendering } from '@libs/app-fns';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { UIElementProps } from '@libs/ui';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { ChangeEvent, ReactNode, useMemo } from 'react';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { EstimatedLiquidationPrice } from './EstimatedLiquidationPrice';
import { LTVGraph } from './LTVGraph';
import { BorrowFormParams } from './types';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';
import big from 'big.js';

export interface BorrowDialogParams extends UIElementProps, BorrowFormParams {
  txResult: StreamResult<TxResultRendering> | null;
  proceedable: boolean;
  onProceed: (borrowAmount: UST, txFee: u<UST>) => void;
}

export type BorrowDialogProps = DialogProps<BorrowDialogParams> & {
  renderBroadcastTxResult?: JSX.Element;
};

function BorrowDialogBase(props: BorrowDialogProps) {
  const {
    className,
    closeDialog,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
    txResult,
    proceedable,
    onProceed,
    renderBroadcastTxResult,
  } = props;

  const { availablePost, connected } = useAccount();

  const [openConfirm, confirmElement] = useConfirm();

  const [input, states] = useBorrowBorrowForm(
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const updateBorrowAmount = useCallback(
    (nextBorrowAmount: string) => {
      input({
        borrowAmount: nextBorrowAmount as UST,
      });
    },
    [input],
  );

  const proceed = useCallback(
    async (borrowAmount: UST, txFee: u<UST>, confirm: ReactNode) => {
      if (!connected || !onProceed) {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      onProceed(borrowAmount, txFee);
    },
    [onProceed, connected, openConfirm],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({
          borrowAmount: formatUSTInput(demicrofy(nextAmount)),
        });
      } catch {}
    },
    [input, states.ltvToAmount],
  );

  const renderBroadcastTx = useMemo(() => {
    if (renderBroadcastTxResult) {
      return renderBroadcastTxResult;
    }

    return (
      <TxResultRenderer
        resultRendering={(txResult as BroadcastTxStreamResult).value}
        onExit={closeDialog}
      />
    );
  }, [renderBroadcastTxResult, closeDialog, txResult]);

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>{renderBroadcastTx}</Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>
          Borrow{' '}
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

        {!!states.invalidTxFee && (
          <MessageBox>{states.invalidTxFee}</MessageBox>
        )}

        <NumberInput
          className="amount"
          value={states.borrowAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!states.invalidBorrowAmount || !!states.invalidOverMaxLtv}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBorrowAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div
          className="wallet"
          aria-invalid={
            !!states.invalidBorrowAmount || !!states.invalidOverMaxLtv
          }
        >
          <span>{states.invalidBorrowAmount ?? states.invalidOverMaxLtv}</span>
          <span>
            {formatRate(ANCHOR_SAFE_RATIO as Rate<number>)}% Borrow Usage:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateBorrowAmount(formatUSTInput(demicrofy(states.safeMax)))
              }
            >
              {formatUST(demicrofy(states.safeMax))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!connected || states.max.lte(0)}
            borrowLimit={states.borrowLimit}
            start={states.currentLtv?.toNumber() ?? 0}
            end={ANCHOR_DANGER_RATIO}
            value={states.nextLtv}
            onChange={onLtvChange}
            onStep={states.ltvStepFunction}
          />
        </figure>

        {states.nextLtv?.gt(ANCHOR_SAFE_RATIO) && (
          <MessageBox
            level="error"
            hide={{ id: 'borrow-ltv', period: 1000 * 60 * 60 * 24 * 5 }}
            style={{ userSelect: 'none', fontSize: 12 }}
          >
            Caution: Borrowing is available only up to 95% borrow usage. If the
            borrow usage reaches the maximum (100%), a portion of your
            collateral may be immediately liquidated to repay part of the loan.
          </MessageBox>
        )}

        {states.nextLtv?.gt(states.currentLtv ?? 0) && (
          <EstimatedLiquidationPrice>
            {states.estimatedLiquidationPrice}
          </EstimatedLiquidationPrice>
        )}

        {states.txFee && states.receiveAmount && states.receiveAmount.gt(0) && (
          <TxFeeList className="receipt">
            {big(states.txFee).gt(0) && (
              <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
                {formatUST(demicrofy(states.txFee))} UST
              </TxFeeListItem>
            )}
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(states.receiveAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !availablePost ||
              !connected ||
              !states.availablePost ||
              !proceedable
            }
            onClick={() =>
              states.txFee &&
              proceed(
                states.borrowAmount,
                states.txFee.toFixed() as u<UST>,
                states.warningOverSafeLtv,
              )
            }
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>

        {confirmElement}
      </Dialog>
    </Modal>
  );
}

export const BorrowDialog = styled(BorrowDialogBase)`
  width: 720px;
  touch-action: none;

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
  }

  .graph {
    margin-top: 80px;
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
