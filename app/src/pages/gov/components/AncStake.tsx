import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatANCInput,
  formatUST,
} from '@anchor-protocol/notation';
import { ANC, Second } from '@anchor-protocol/types';
import { useRewardsAncGovernanceRewardsQuery } from '@anchor-protocol/app-provider';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy, microfy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import { validateTxFee } from '@anchor-protocol/app-fns';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useBalances } from 'contexts/balances';
import { useLockAncTx } from 'tx/gov/useLockAncTx';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import { DurationSlider, SliderPlaceholder } from 'components/sliders';
import styled from 'styled-components';
import { VStack } from '@libs/ui/Stack';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { UIElementProps } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';
import { EstimatedVeAncAmount } from './EstimatedVeAncAmount';
import { useMyVotingLockPeriodEndsAtQuery } from 'queries';
import { millisecondsInSecond } from 'date-fns';

function AncStakeBase(props: UIElementProps) {
  const { className } = props;

  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [lock, lockResult] = useLockAncTx();

  const [amount, setAmount] = useState<ANC>('' as ANC);

  const { data: lockPeriodEndsAt, isFetched: isLockPeriodEndsAtFetched } =
    useMyVotingLockPeriodEndsAtQuery();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const [period, setPeriod] = useState<Second | undefined>();
  const currentPeriod = useMemo(() => {
    const now = Date.now();
    if (lockPeriodEndsAt === undefined || lockPeriodEndsAt < now) {
      return;
    }

    return ((lockPeriodEndsAt - now) / millisecondsInSecond) as Second;
  }, [lockPeriodEndsAt]);

  useEffect(() => {
    if (!isLockPeriodEndsAtFetched) {
      return;
    }

    if (lockPeriodEndsAt !== undefined && lockPeriodEndsAt > Date.now()) {
      return;
    }

    if (period === undefined && lockConfig) {
      setPeriod(lockConfig.minLockTime);
    }
  }, [isLockPeriodEndsAtFetched, lockConfig, lockPeriodEndsAt, period]);

  const { uUST } = useBalances();

  const { data: { userANCBalance } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const invalidTxFee = connected && validateTxFee(uUST, fixedFee);

  const invalidANCAmount =
    amount.length === 0 || !userANCBalance
      ? undefined
      : big(microfy(amount)).gt(userANCBalance.balance)
      ? 'Not enough assets'
      : undefined;

  const isSubmitEnabled =
    (availablePost &&
      connected &&
      lock &&
      (period || currentPeriod) &&
      !invalidTxFee) ||
    !invalidANCAmount;

  const proceed = useCallback(() => {
    if (!isSubmitEnabled || !lock) {
      return;
    }

    lock({
      amount,
      period,
      onTxSucceed: () => {
        setAmount('' as ANC);
      },
    });
  }, [amount, isSubmitEnabled, lock, period]);

  if (
    lockResult?.status === StreamStatus.IN_PROGRESS ||
    lockResult?.status === StreamStatus.DONE
  ) {
    return (
      <TxResultRenderer
        resultRendering={lockResult.value}
        onExit={() => {
          setAmount('' as ANC);

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
      {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

      <NumberInput
        className="amount"
        value={amount}
        amount={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        error={!!invalidANCAmount}
        placeholder="0.00"
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setAmount(target.value as ANC)
        }
        InputProps={{
          endAdornment: <InputAdornment position="end">ANC</InputAdornment>,
        }}
      />

      <VStack fullWidth gap={20}>
        <div className="wallet" aria-invalid={!!invalidANCAmount}>
          <span>{invalidANCAmount}</span>
          <span>
            Balance:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                userANCBalance &&
                setAmount(formatANCInput(demicrofy(userANCBalance.balance)))
              }
            >
              {userANCBalance
                ? formatANC(demicrofy(userANCBalance.balance))
                : 0}{' '}
              ANC
            </span>
          </span>
        </div>

        {amount.length > 0 && period !== undefined && (
          <>
            <Divider />
            <VStack className="duration-slider" gap={8}>
              <h3>
                <IconSpan>
                  LOCK PERIOD{' '}
                  <InfoTooltip>
                    The time that your ANC will be locked in the vesting
                    contract.
                  </InfoTooltip>
                </IconSpan>
              </h3>
              {period !== undefined && lockConfig !== undefined ? (
                <DurationSlider
                  value={period}
                  min={lockConfig.minLockTime}
                  max={lockConfig.maxLockTime}
                  step={lockConfig.periodDuration}
                  onChange={setPeriod}
                />
              ) : (
                <SliderPlaceholder />
              )}
            </VStack>
          </>
        )}
      </VStack>

      {amount.length > 0 && (
        <TxFeeList className="receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
          <EstimatedVeAncAmount
            period={period || currentPeriod}
            amount={amount}
          />
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
  .duration-slider {
    xposition: relative;
    h3 {
      xposition: absolute;
      xtop: 8px;
      font-size: 12px;
      font-weight: 500;
    }
  }
`;
