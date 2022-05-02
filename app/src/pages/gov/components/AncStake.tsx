import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
  formatANCInput,
  formatUST,
  formatVeAnc,
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
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useBalances } from 'contexts/balances';
import { useLockAncTx } from 'tx/gov/useLockAncTx';
import { useVotingEscrowConfigQuery } from 'queries/gov/useVotingEscrowConfigQuery';
import { DurationSlider, SliderPlaceholder } from 'components/sliders';
import styled from 'styled-components';
import { VStack } from '@libs/ui/Stack';
import { useMyLockInfoQuery } from 'queries/gov/useMyLockInfoQuery';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { computeEstimatedVeAnc } from '../logics/computeEstimatedVeAnc';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { UIElementProps } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';

function AncStakeBase(props: UIElementProps) {
  const { className } = props;

  const { availablePost, connected } = useAccount();

  const fixedFee = useFixedFee();

  const [lock, lockResult] = useLockAncTx();

  const [amount, setAmount] = useState<ANC>('' as ANC);

  const { data: lockInfo, isFetched: isLockInfoFetched } = useMyLockInfoQuery();

  const { data: lockConfig } = useVotingEscrowConfigQuery();

  const [period, setPeriod] = useState<Second | undefined>();
  useEffect(() => {
    if (period === undefined && lockConfig) {
      setPeriod(
        isLockInfoFetched && lockInfo?.period
          ? lockInfo.period
          : lockConfig.minLockTime,
      );
    }
  }, [period, lockConfig, lockInfo, isLockInfoFetched]);

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

  const proceed = useCallback(() => {
    if (!connected || !lock || period === undefined) {
      return;
    }

    lock({
      amount,
      period: lockInfo?.period ? undefined : period,
      onTxSucceed: () => {
        setAmount('' as ANC);
      },
    });
  }, [amount, connected, lock, lockInfo?.period, period]);

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

        {amount.length > 0 && lockInfo?.period === undefined && (
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
              {/* <Label>Lock Period</Label> */}
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
          {lockConfig && period && (
            <TxFeeListItem label={`Receive ${VEANC_SYMBOL}`}>
              {formatVeAnc(
                computeEstimatedVeAnc(
                  lockConfig.boostCoefficient,
                  period,
                  lockConfig.maxLockTime,
                  amount || ('0' as ANC),
                ),
              )}{' '}
              {VEANC_SYMBOL}
            </TxFeeListItem>
          )}
        </TxFeeList>
      )}

      <ViewAddressWarning>
        <ActionButton
          className="submit"
          disabled={
            !availablePost ||
            !connected ||
            !lock ||
            period === undefined ||
            amount.length === 0 ||
            big(amount).lte(0) ||
            !!invalidTxFee ||
            !!invalidANCAmount
          }
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

// const Label = styled.p`
//   font-size: 16px;
//   color: ${({ theme }) => theme.dimTextColor};
// `;
