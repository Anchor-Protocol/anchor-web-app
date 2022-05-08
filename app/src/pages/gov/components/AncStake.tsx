import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import classNames from 'classnames';
import { ANC, Second } from '@anchor-protocol/types';
import { formatTimestamp } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import React, { ChangeEvent, useCallback } from 'react';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import { WeeklyDurationSlider } from 'components/sliders';
import styled from 'styled-components';
import { VStack } from '@libs/ui/Stack';
import { UIElementProps } from '@libs/ui';
import { EstimatedVeAncAmount } from './EstimatedVeAncAmount';
import { useLockAncTx } from 'tx/terra';
import { useStakeAncForm } from '../forms/useStakeAncForm';
import { useFormatters } from '@anchor-protocol/formatter';
import { computeLockPeriod } from '../logics/computeLockPeriod';

function AncStakeBase(props: UIElementProps) {
  const { className } = props;

  const { connected } = useAccount();

  const { ust, anc } = useFormatters();

  const [input, state] = useStakeAncForm();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const [lock, lockResult] = useLockAncTx();

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
    if (state.amount && isSubmitEnabled && lock && lockConfig) {
      lock({
        amount: state.amount as ANC<number>,
        period: state.lockPeriod
          ? computeLockPeriod(lockConfig, state.lockPeriod)
          : undefined,
      });
    }
  }, [state.amount, state.lockPeriod, isSubmitEnabled, lock, lockConfig]);

  if (
    lockResult?.status === StreamStatus.IN_PROGRESS ||
    lockResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={lockResult.value}
        onExit={() => {
          updateAmount(undefined);

          switch (lockResult.status) {
            case StreamStatus.IN_PROGRESS:
              lockResult.abort();
              break;
            case StreamStatus.DONE:
              lockResult.clear();
              break;
          }
        }}
      />
    );
  }

  return (
    <div className={className}>
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
              onClick={() => updateAmount(Big(state.walletBalance).toNumber())}
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
              {`${ust.formatOutput(ust.demicrofy(state.txFee))} ${ust.symbol}`}
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
              amount={state.amount ? (state.amount as ANC<number>) : undefined}
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
    </div>
  );
}

export const AncStake = styled(AncStakeBase)`
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
