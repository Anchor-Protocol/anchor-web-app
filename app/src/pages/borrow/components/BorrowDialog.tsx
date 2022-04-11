import {
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
  computeBorrowAmountToLtv,
  computeLtvToBorrowAmount,
} from '@anchor-protocol/app-fns';
import {
  useBorrowBorrowForm,
  useDeploymentTarget,
} from '@anchor-protocol/app-provider';
import {
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { CollateralAmount, Rate, u, UST } from '@anchor-protocol/types';
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
import {
  StreamDone,
  StreamInProgress,
  StreamResult,
  StreamStatus,
} from '@rx-stream/react';
import { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { ChangeEvent, ReactNode } from 'react';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import big from 'big.js';
import { BorrowCollateralInput } from './BorrowCollateralInput';
import { EstimatedLiquidationPrice } from './EstimatedLiquidationPrice';
import { LTVGraph } from './LTVGraph';
import { BorrowFormParams } from './types';
import { PageDivider } from './PageDivider';
import { WhitelistCollateral } from 'queries';
import { useBalances } from 'contexts/balances';

export interface BorrowDialogParams extends UIElementProps, BorrowFormParams {
  txResult: StreamResult<TxResultRendering> | null;
  proceedable: boolean;
  onProceed: (
    borrowAmount: UST,
    txFee: u<UST>,
    collateral?: WhitelistCollateral,
    collateralAmount?: u<CollateralAmount<Big>>,
  ) => void;
}

interface TxRenderFnProps {
  txResult:
    | StreamInProgress<TxResultRendering<unknown>>
    | StreamDone<TxResultRendering<unknown>>;
  closeDialog: () => void;
}

type TxRenderFn = (props: TxRenderFnProps) => JSX.Element;

export type BorrowDialogProps = DialogProps<BorrowDialogParams> & {
  renderTxResult?: TxRenderFn;
};

function BorrowDialogBase(props: BorrowDialogProps) {
  const {
    className,
    closeDialog,
    txResult,
    proceedable,
    onProceed,
    renderTxResult,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  } = props;

  const {
    target: { isNative },
  } = useDeploymentTarget();

  const { availablePost, connected } = useAccount();

  const { fetchWalletBalance } = useBalances();

  const [input, states] = useBorrowBorrowForm(
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const [openConfirm, confirmElement] = useConfirm();

  const updateBorrowAmount = useCallback(
    (nextBorrowAmount: string) => {
      input({
        borrowAmount: nextBorrowAmount as UST,
      });
    },
    [input],
  );

  const onCollateralChanged = useCallback(
    (collateral: WhitelistCollateral) => {
      input({
        collateral,
        collateralAmount: undefined,
        maxCollateralAmount: Big(0) as u<CollateralAmount<Big>>,
      });

      fetchWalletBalance(collateral).then((maxCollateralAmount) => {
        input({ maxCollateralAmount });
      });
    },
    [input, fetchWalletBalance],
  );

  const proceed = useCallback(
    async (
      borrowAmount: UST,
      txFee: u<UST>,
      confirm: ReactNode,
      collateral?: WhitelistCollateral,
      collateralAmount?: u<CollateralAmount<Big>>,
    ) => {
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

      onProceed(borrowAmount, txFee, collateral, collateralAmount);
    },
    [onProceed, connected, openConfirm],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Rate<Big>) => {
      const amount = computeLtvToBorrowAmount(
        draftLtv,
        states.borrowLimit,
        states.borrowedAmount,
      );

      return computeBorrowAmountToLtv(
        amount,
        states.borrowLimit,
        states.borrowedAmount,
      );
    },
    [states.borrowLimit, states.borrowedAmount],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = computeLtvToBorrowAmount(
          nextLtv,
          states.borrowLimit,
          states.borrowedAmount,
        );
        input({
          borrowAmount: formatUSTInput(demicrofy(nextAmount)),
        });
      } catch {}
    },
    [input, states.borrowLimit, states.borrowedAmount],
  );

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          {renderTxResult ? (
            renderTxResult({ txResult, closeDialog })
          ) : (
            <TxResultRenderer
              resultRendering={txResult.value}
              onExit={closeDialog}
            />
          )}
        </Dialog>
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
            onStep={ltvStepFunction}
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

        {isNative === false ||
          (false && (
            <>
              <PageDivider />
              <BorrowCollateralInput
                collateral={states.collateral}
                onCollateralChange={onCollateralChanged}
                maxCollateralAmount={states.maxCollateralAmount}
                warningMessage={states.invalidCollateralAmount}
                amount={states.collateralAmount}
                onAmountChange={(collateralAmount) => {
                  input({
                    collateralAmount,
                  });
                }}
              />
            </>
          ))}

        {states.txFee &&
          states.txFee.gt(0) &&
          states.receiveAmount &&
          states.receiveAmount.gt(0) && (
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
                states.collateral,
                states.collateralAmount,
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
