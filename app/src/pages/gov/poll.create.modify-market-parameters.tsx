import { ExecuteMsg } from '@anchor-protocol/app-fns';
import { moneyMarket, Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
import { floor } from '@libs/big-math';
import { formatExecuteMsgNumber } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateModifyMarketParameters() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    constants: { blocksPerYear },
    contractAddress: address,
  } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [targetDepositRate, setTargetDepositRate] = useState<string>('');
  const [thresholdDepositRate, setThresholdDepositRate] = useState<string>('');
  const [bufferDistributionFactor, setBufferDistributionFactor] =
    useState<string>('');
  const [maxBorrowFactor, setMaxBorrowFactor] = useState<string>('');
  const [validPriceTimeframe, setValidPriceTimeframe] = useState<string>('');

  const inputDisabled = useMemo(() => {
    if (targetDepositRate.length > 0) {
      return {
        targetDepositRate: false,
        thresholdDepositRate: true,
        bufferDistributionFactor: true,
        maxBorrowFactor: true,
        validPriceTimeframe: true,
      };
    } else if (thresholdDepositRate.length > 0) {
      return {
        targetDepositRate: true,
        thresholdDepositRate: false,
        bufferDistributionFactor: true,
        maxBorrowFactor: true,
        validPriceTimeframe: true,
      };
    } else if (bufferDistributionFactor.length > 0) {
      return {
        targetDepositRate: true,
        thresholdDepositRate: true,
        bufferDistributionFactor: false,
        maxBorrowFactor: true,
        validPriceTimeframe: true,
      };
    }
    if (maxBorrowFactor.length > 0) {
      return {
        targetDepositRate: true,
        thresholdDepositRate: true,
        bufferDistributionFactor: true,
        maxBorrowFactor: false,
        validPriceTimeframe: true,
      };
    } else if (validPriceTimeframe.length > 0) {
      return {
        targetDepositRate: true,
        thresholdDepositRate: true,
        bufferDistributionFactor: true,
        maxBorrowFactor: true,
        validPriceTimeframe: false,
      };
    } else {
      return {
        targetDepositRate: false,
        thresholdDepositRate: false,
        bufferDistributionFactor: false,
        maxBorrowFactor: false,
        validPriceTimeframe: false,
      };
    }
  }, [
    bufferDistributionFactor.length,
    maxBorrowFactor.length,
    targetDepositRate.length,
    thresholdDepositRate.length,
    validPriceTimeframe.length,
  ]);

  const invalidBufferDistributionFactor = useMemo(() => {
    if (bufferDistributionFactor.length === 0) return undefined;

    return big(bufferDistributionFactor).lt(1)
      ? 'Please input LTV between 1 ~ 99'
      : undefined;
  }, [bufferDistributionFactor]);

  const invalidMaxBorrowFactor = useMemo(() => {
    if (maxBorrowFactor.length === 0) return undefined;

    return big(maxBorrowFactor).lt(1)
      ? 'Please input LTV between 1 ~ 99'
      : undefined;
  }, [maxBorrowFactor]);

  const invalidTargetDepositRate = useMemo(() => {
    if (targetDepositRate.length === 0) return undefined;

    return big(targetDepositRate).lt(1)
      ? 'Please input LTV between 1 ~ 99'
      : undefined;
  }, [targetDepositRate]);

  const invalidThresholdDepositRate = useMemo(() => {
    if (thresholdDepositRate.length === 0) return undefined;

    return big(thresholdDepositRate).lt(1)
      ? 'Please input LTV between 1 ~ 99'
      : undefined;
  }, [thresholdDepositRate]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (
      targetDepositRate: string,
      thresholdDepositRate: string,
      bufferDistributionFactor: string,
      maxBorrowFactor: string,
      validPriceTimeframe: string,
    ): ExecuteMsg[] => {
      const overseerUpdateConfig: moneyMarket.overseer.UpdateConfig['update_config'] =
        {};
      const marketUpdateConfig: moneyMarket.market.UpdateConfig['update_config'] =
        {};

      if (targetDepositRate.length > 0) {
        overseerUpdateConfig['target_deposit_rate'] = formatExecuteMsgNumber(
          big(targetDepositRate).div(100).div(blocksPerYear),
        ) as Rate;
      }

      if (thresholdDepositRate.length > 0) {
        overseerUpdateConfig['threshold_deposit_rate'] = formatExecuteMsgNumber(
          big(thresholdDepositRate).div(100).div(blocksPerYear),
        ) as Rate;
      }

      if (bufferDistributionFactor.length > 0) {
        overseerUpdateConfig['buffer_distribution_factor'] =
          formatExecuteMsgNumber(
            big(bufferDistributionFactor).div(100),
          ) as Rate;
      }

      if (validPriceTimeframe.length > 0) {
        overseerUpdateConfig['price_timeframe'] = floor(
          big(validPriceTimeframe),
        ).toNumber();
      }

      if (maxBorrowFactor.length > 0) {
        marketUpdateConfig['max_borrow_factor'] = big(maxBorrowFactor)
          .div(100)
          .toFixed() as Rate;
      }

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (Object.keys(overseerUpdateConfig).length > 0) {
        msgs.push({
          contract: address.moneyMarket.overseer,
          msg: Buffer.from(
            JSON.stringify({
              update_config: overseerUpdateConfig,
            }),
          ).toString('base64'),
        });
      }

      if (Object.keys(marketUpdateConfig).length > 0) {
        msgs.push({
          contract: address.moneyMarket.market,
          msg: Buffer.from(
            JSON.stringify({
              update_config: marketUpdateConfig,
            }),
          ).toString('base64'),
        });
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.moneyMarket.market, address.moneyMarket.overseer, blocksPerYear],
  );

  console.log(
    'poll.create.modify-market-parameters.tsx..PollCreateModifyMarketParameters()',
    invalidThresholdDepositRate,
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify Market Parameters"
      submitDisabled={
        (targetDepositRate.length === 0 &&
          thresholdDepositRate.length === 0 &&
          bufferDistributionFactor.length === 0 &&
          maxBorrowFactor.length === 0 &&
          validPriceTimeframe.length === 0) ||
        !!invalidBufferDistributionFactor ||
        !!invalidThresholdDepositRate ||
        !!invalidTargetDepositRate ||
        !!invalidMaxBorrowFactor
      }
      onCreateMsgs={() =>
        createMsgs(
          targetDepositRate,
          thresholdDepositRate,
          bufferDistributionFactor,
          maxBorrowFactor,
          validPriceTimeframe,
        )
      }
    >
      <div
        className="description"
        aria-disabled={inputDisabled.targetDepositRate}
      >
        <p>
          <IconSpan>
            Target Deposit Rate{' '}
            <InfoTooltip>Target stablecoin deposit rate for Anchor</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={targetDepositRate}
        disabled={inputDisabled.targetDepositRate}
        error={!!invalidTargetDepositRate}
        helperText={invalidTargetDepositRate}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setTargetDepositRate(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.thresholdDepositRate}
      >
        <p>
          <IconSpan>
            Threshold Deposit Rate{' '}
            <InfoTooltip>
              Threshold deposit rate to trigger interest buffer distribution
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={thresholdDepositRate}
        disabled={inputDisabled.thresholdDepositRate}
        error={!!invalidThresholdDepositRate}
        helperText={invalidThresholdDepositRate}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setThresholdDepositRate(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.bufferDistributionFactor}
      >
        <p>
          <IconSpan>
            Buffer Distribution Factor{' '}
            <InfoTooltip>
              Maximum portion of interest buffer that can be distributed in an
              epoch
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={bufferDistributionFactor}
        disabled={inputDisabled.bufferDistributionFactor}
        error={!!invalidBufferDistributionFactor}
        helperText={invalidBufferDistributionFactor}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBufferDistributionFactor(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.maxBorrowFactor}
      >
        <p>
          <IconSpan>
            Max Borrow Factor{' '}
            <InfoTooltip>
              Maximum portion of stablecoin liquidity available to borrower
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={maxBorrowFactor}
        disabled={inputDisabled.maxBorrowFactor}
        error={!!invalidMaxBorrowFactor}
        helperText={invalidMaxBorrowFactor}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setMaxBorrowFactor(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.validPriceTimeframe}
      >
        <p>
          <IconSpan>
            Valid Price Timeframe{' '}
            <InfoTooltip>
              Window of time before price data is considered outdated
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0"
        type="integer"
        maxIntegerPoinsts={3}
        InputProps={{
          endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
        }}
        value={validPriceTimeframe}
        disabled={inputDisabled.validPriceTimeframe}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setValidPriceTimeframe(target.value)
        }
      />
    </PollCreateBase>
  );
}
