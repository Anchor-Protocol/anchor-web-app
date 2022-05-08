import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
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
import big from 'big.js';
import { SliderPlaceholder, WeeklyDurationSlider } from 'components/sliders';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';
import { DialogTitle } from '@libs/ui/text/DialogTitle';
import { formatTimestamp, getCurrentTimeZone } from '@libs/formatter';
import { VStack } from '@libs/ui/Stack';
import classNames from 'classnames';
import { EstimatedVeAncAmount } from '../EstimatedVeAncAmount';
import { computeLockPeriod } from 'pages/gov/logics/computeLockPeriod';
import { Second } from '@libs/types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { useExtendAncLockForm } from 'pages/gov/forms/useExtendAncLockForm';
import { useVotingEscrowConfigQuery } from 'queries';

interface ExtendAncLockDialogParams extends UIElementProps {
  txResult: StreamResult<TxResultRendering> | null;
}

export type ExtendAncLockDialogOuterProps = {};

type ExtendAncLockDialogReturn = void;
type ExtendAncLockDialogProps = DialogProps<
  ExtendAncLockDialogParams,
  ExtendAncLockDialogReturn
> & {
  renderBroadcastTxResult?: JSX.Element;
  onProceed: (period: Second) => void;
};

export const ExtendAncLockDialog = ({
  closeDialog,
  renderBroadcastTxResult,
  txResult,
  onProceed,
  className,
}: ExtendAncLockDialogProps) => {
  const { ust, anc } = useFormatters();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const [input, state] = useExtendAncLockForm();

  const isSubmitDisabled =
    !state.availablePost ||
    state.invalidLockPeriod ||
    !state.lockPeriod ||
    state.invalidTxFee;

  const updateLockAmount = useCallback(
    (amount?: number) => {
      input({ lockPeriod: amount });
    },
    [input],
  );

  const proceed = useCallback(() => {
    if (state.lockPeriod && onProceed) {
      onProceed(state.lockPeriod as Second);
    }
  }, [state.lockPeriod, onProceed]);

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
        <DialogTitle>Lock Period</DialogTitle>
        {!!state.invalidTxFee && <MessageBox>{state.invalidTxFee}</MessageBox>}

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
            endAdornment: <InputAdornment position="end">WEEKS</InputAdornment>,
          }}
        />

        {state.invalidLockPeriod && (
          <span className="error-text">{state.invalidLockPeriod}</span>
        )}

        <IconLineSeparator style={{ margin: '10px 0' }} />

        <TextInput
          className="input"
          value={
            state.estimatedLockPeriodEndsAt
              ? formatTimestamp(state.estimatedLockPeriodEndsAt, false)
              : ''
          }
          label="APPROX UNLOCK TIME"
          readOnly
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                {getCurrentTimeZone()}
              </InputAdornment>
            ),
          }}
          style={{ pointerEvents: 'none' }}
        />

        <VStack
          className={classNames('duration-slider', {
            'duration-slider--error': state.invalidLockPeriod,
          })}
          gap={8}
          fullWidth
        >
          {lockConfig ? (
            <WeeklyDurationSlider
              value={state.lockPeriod ?? state.minLockPeriod}
              min={0}
              max={state.maxLockPeriod}
              errored={Boolean(state.invalidLockPeriod)}
              onChange={(value: number) => {
                updateLockAmount(value);
              }}
            />
          ) : (
            <SliderPlaceholder />
          )}
        </VStack>

        <TxFeeList className="receipt">
          {big(state.txFee).gt(0) && (
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {`${ust.formatOutput(ust.demicrofy(state.txFee))} ${ust.symbol}`}
            </TxFeeListItem>
          )}
          {lockConfig && (
            <EstimatedVeAncAmount
              period={
                state.lockPeriod
                  ? computeLockPeriod(lockConfig, state.lockPeriod)
                  : (0 as Second)
              }
              amount={
                state.totalAncStaked
                  ? anc.demicrofy(state.totalAncStaked)
                  : undefined
              }
            />
          )}
        </TxFeeList>

        <ActionButton
          className="submit"
          disabled={isSubmitDisabled}
          onClick={proceed}
        >
          Extend
        </ActionButton>
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

  .graph {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .receipt {
    margin-top: 30px;
  }

  .submit {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
