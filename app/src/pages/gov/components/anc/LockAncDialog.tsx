import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { UIElementProps } from '@libs/ui';
import { TxResultRendering } from '@libs/app-fns';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import big, { Big } from 'big.js';
import { WeeklyDurationSlider } from 'components/sliders';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';
import { DialogTitle } from '@libs/ui/text/DialogTitle';
import { formatTimestamp } from '@libs/formatter';
import { VStack } from '@libs/ui/Stack';
import classNames from 'classnames';
import { EstimatedVeAncAmount } from '../EstimatedVeAncAmount';
import { computeLockPeriod } from 'pages/gov/logics/computeLockPeriod';
import { Second } from '@libs/types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useVotingEscrowConfigQuery } from 'queries';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { ANC } from '@anchor-protocol/types';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { useAccount } from 'contexts/account';
import { useStakeAncForm } from 'pages/gov/forms/useStakeAncForm';

interface LockAncDialogParams extends UIElementProps {
  txResult: StreamResult<TxResultRendering> | null;
}

export type LockAncDialogOuterProps = {};

type LockAncDialogReturn = void;
type LockAncDialogProps = DialogProps<
  LockAncDialogParams,
  LockAncDialogReturn
> & {
  renderBroadcastTxResult?: JSX.Element;
  onProceed: (amount: ANC<number>, period?: Second) => void;
};

export const LockAncDialog = ({
  closeDialog,
  renderBroadcastTxResult,
  txResult,
  onProceed,
  className,
}: LockAncDialogProps) => {
  const { connected } = useAccount();

  const { ust, anc } = useFormatters();

  const [input, state] = useStakeAncForm();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const isSubmitEnabled =
    connected &&
    state.amount &&
    state.amount > 0 &&
    state.availablePost &&
    !state.invalidAmount &&
    !state.invalidLockPeriod &&
    !state.invalidTxFee;

  const updateAmount = useCallback(
    (amount: number | undefined) => {
      input({ amount });
    },
    [input],
  );

  const updateLockAmount = useCallback(
    (amount?: number) => {
      input({ lockPeriod: amount });
    },
    [input],
  );

  const proceed = useCallback(() => {
    if (state.amount && isSubmitEnabled && lockConfig && onProceed) {
      onProceed(
        state.amount as ANC<number>,
        state.lockPeriod
          ? computeLockPeriod(lockConfig, state.lockPeriod)
          : undefined,
      );
    }
  }, [state.amount, state.lockPeriod, isSubmitEnabled, lockConfig, onProceed]);

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
      <Container onClose={() => closeDialog()}>
        <DialogTitle>Stake ANC</DialogTitle>
        {!!state.invalidTxFee && <MessageBox>{state.invalidTxFee}</MessageBox>}

        <VStack fullWidth>
          <NumberInput
            className="amount"
            value={state.amount ?? ''}
            amount={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
            maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
            error={!!state.invalidAmount}
            placeholder="0.00"
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
              const amount =
                target.value?.length === 0 ? undefined : Number(target.value);
              updateAmount(amount);
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
            }}
          />

          <div className="wallet" aria-invalid={!!state.invalidAmount}>
            <span>{state.invalidAmount}</span>
            <span>
              Balance:{' '}
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  updateAmount(Big(state.walletBalance).toNumber())
                }
              >
                {anc.formatOutput(state.walletBalance)}
                ANC
              </span>
            </span>
          </div>
        </VStack>

        {lockConfig && state.requiresLockPeriod && (
          <VStack className="lock-container" fullWidth>
            <NumberInput
              className="input"
              value={state.lockPeriod}
              maxDecimalPoints={0}
              label="LOCK PERIOD"
              error={!!state.invalidLockPeriod}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                const amount =
                  target.value?.length === 0 ? undefined : Number(target.value);
                updateLockAmount(amount);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">WEEKS</InputAdornment>
                ),
              }}
            />
            {state.invalidLockPeriod && (
              <span className="error-text">{state.invalidLockPeriod}</span>
            )}
            <div
              className={classNames('duration-slider', {
                'duration-slider--error': state.invalidLockPeriod,
              })}
            >
              <WeeklyDurationSlider
                value={state.lockPeriod ?? state.minLockPeriod}
                min={0}
                max={state.maxLockPeriod}
                errored={Boolean(state.invalidLockPeriod)}
                onChange={(value: number) => {
                  updateLockAmount(value);
                }}
              />
            </div>
          </VStack>
        )}

        {(state.amount || state.lockPeriod) && (
          <TxFeeList className="receipt">
            {big(state.txFee).gt(0) && (
              <TxFeeListItem label="Tx Fee">
                {`${ust.formatOutput(ust.demicrofy(state.txFee))} ${
                  ust.symbol
                }`}
              </TxFeeListItem>
            )}

            {state.requiresLockPeriod && state.estimatedLockPeriodEndsAt && (
              <TxFeeListItem label="Approx Unlock Time">
                {formatTimestamp(state.estimatedLockPeriodEndsAt)}
              </TxFeeListItem>
            )}

            {lockConfig && state.requiresLockPeriod && (
              <EstimatedVeAncAmount
                period={
                  state.lockPeriod
                    ? computeLockPeriod(lockConfig, state.lockPeriod)
                    : (0 as Second)
                }
                amount={
                  state.amount ? (state.amount as ANC<number>) : undefined
                }
              />
            )}
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={!isSubmitEnabled}
            onClick={proceed}
          >
            Stake
          </ActionButton>
        </ViewAddressWarning>
      </Container>
    </Modal>
  );
};

export const Container = styled(Dialog)`
  width: 720px;
  touch-action: none;

  h1 {
    margin-bottom: 50px;
  }

  .input {
    width: 100%;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .error-text {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.negative};
  }

  .duration-slider {
    margin-top: 20px;
  }

  .duration-slider--error {
    .thumb-label {
      background-color: ${({ theme }) => theme.colors.negative};
      &::after {
        border-color: ${({ theme }) => theme.colors.negative} transparent
          transparent transparent;
      }
    }
  }

  .lock-container {
    margin-top: 40px;
  }

  .error-text {
    margin-top: 5px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.negative};
  }

  .duration-slider {
    margin-top: 20px;
  }

  .duration-slider--error {
    .thumb-label {
      background-color: ${({ theme }) => theme.colors.negative};
      &::after {
        border-color: ${({ theme }) => theme.colors.negative} transparent
          transparent transparent;
      }
    }
  }
`;
