import { ExecuteMsg } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useGovDistributionModelUpdateConfigQuery,
} from '@anchor-protocol/app-provider';
import { ANC, moneyMarket, Rate, u } from '@anchor-protocol/types';
import {
  formatExecuteMsgNumber,
  MAX_EXECUTE_MSG_DECIMALS,
} from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateModifyANCDistribution() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { contractAddress: address } = useAnchorWebapp();

  const { data: { distributionModelConfig } = {} } =
    useGovDistributionModelUpdateConfigQuery();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [borrowerEmissionCap, setBorrowerEmissionCap] = useState<string>('');
  const [borrowerEmissionFloor, setBorrowerEmissionFloor] =
    useState<string>('');
  const [incrementMultiplier, setIncrementMultiplier] = useState<string>('');
  const [decrementMultiplier, setDecrementMultiplier] = useState<string>('');

  const invalidBorrowerEmissionCap = useMemo(() => {
    if (borrowerEmissionCap.length === 0 || !distributionModelConfig) {
      return undefined;
    }

    return big(borrowerEmissionCap).lte(distributionModelConfig.emission_floor)
      ? `emission_cap must be higher than emission_floor (${distributionModelConfig.emission_floor})`
      : undefined;
  }, [borrowerEmissionCap, distributionModelConfig]);

  const invalidBorrowerEmissionFloor = useMemo(() => {
    if (borrowerEmissionFloor.length === 0 || !distributionModelConfig) {
      return undefined;
    }

    return big(borrowerEmissionFloor).gte(distributionModelConfig.emission_cap)
      ? `emission_floor must be lower than emission_cap (${distributionModelConfig.emission_cap})`
      : undefined;
  }, [borrowerEmissionFloor, distributionModelConfig]);

  const invalidIncrementMultiplier = useMemo(() => {
    if (incrementMultiplier.length === 0) {
      return undefined;
    }

    const v = big(incrementMultiplier);

    return v.lt(1) ? `Increment Multiplier should be higher than 1` : undefined;
  }, [incrementMultiplier]);

  const invalidDecrementMultiplier = useMemo(() => {
    if (decrementMultiplier.length === 0) {
      return undefined;
    }

    const v = big(decrementMultiplier);

    return v.lte(0) || v.gt(1)
      ? `Decrement Multiplier must be between 0 and 1`
      : undefined;
  }, [decrementMultiplier]);

  const inputDisabled = useMemo(() => {
    if (borrowerEmissionCap.length > 0) {
      return {
        borrowerEmissionCap: false,
        borrowerEmissionFloor: true,
        incrementMultiplier: true,
        decrementMultiplier: true,
      };
    } else if (borrowerEmissionFloor.length > 0) {
      return {
        borrowerEmissionCap: true,
        borrowerEmissionFloor: false,
        incrementMultiplier: true,
        decrementMultiplier: true,
      };
    } else if (incrementMultiplier.length > 0) {
      return {
        borrowerEmissionCap: true,
        borrowerEmissionFloor: true,
        incrementMultiplier: false,
        decrementMultiplier: true,
      };
    }
    if (decrementMultiplier.length > 0) {
      return {
        borrowerEmissionCap: true,
        borrowerEmissionFloor: true,
        incrementMultiplier: true,
        decrementMultiplier: false,
      };
    } else {
      return {
        borrowerEmissionCap: false,
        borrowerEmissionFloor: false,
        incrementMultiplier: false,
        decrementMultiplier: false,
      };
    }
  }, [
    borrowerEmissionCap.length,
    borrowerEmissionFloor.length,
    decrementMultiplier.length,
    incrementMultiplier.length,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (
      borrowerEmissionCap: string,
      borrowerEmissionFloor: string,
      incrementMultiplier: string,
      decrementMultiplier: string,
    ): ExecuteMsg[] => {
      const distributionModelConfig: moneyMarket.distributionModel.UpdateConfig['update_config'] =
        {};

      if (borrowerEmissionCap.length > 0) {
        distributionModelConfig['emission_cap'] = formatExecuteMsgNumber(
          borrowerEmissionCap,
        ) as u<ANC>;
      }

      if (borrowerEmissionFloor.length > 0) {
        distributionModelConfig['emission_floor'] = formatExecuteMsgNumber(
          borrowerEmissionFloor,
        ) as u<ANC>;
      }

      if (incrementMultiplier.length > 0) {
        distributionModelConfig['increment_multiplier'] =
          formatExecuteMsgNumber(incrementMultiplier) as Rate;
      }

      if (decrementMultiplier.length > 0) {
        distributionModelConfig['decrement_multiplier'] =
          formatExecuteMsgNumber(decrementMultiplier) as Rate;
      }

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (Object.keys(distributionModelConfig).length > 0) {
        msgs.push({
          contract: address.moneyMarket.distributionModel,
          msg: Buffer.from(
            JSON.stringify({
              update_config: distributionModelConfig,
            }),
          ).toString('base64'),
        });
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.moneyMarket.distributionModel],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify ANC Distribution"
      submitDisabled={
        (borrowerEmissionCap.length === 0 &&
          borrowerEmissionFloor.length === 0 &&
          incrementMultiplier.length === 0 &&
          decrementMultiplier.length === 0) ||
        !!invalidDecrementMultiplier ||
        !!invalidIncrementMultiplier
      }
      onCreateMsgs={() =>
        createMsgs(
          borrowerEmissionCap,
          borrowerEmissionFloor,
          incrementMultiplier,
          decrementMultiplier,
        )
      }
    >
      <div
        className="description"
        aria-disabled={inputDisabled.borrowerEmissionCap}
      >
        <p>
          <IconSpan>
            Borrower Emission Cap{' '}
            <InfoTooltip>Maximum per-block ANC emission rate</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={10}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={borrowerEmissionCap}
        disabled={inputDisabled.borrowerEmissionCap}
        InputProps={{
          endAdornment: <InputAdornment position="end">uANC</InputAdornment>,
        }}
        error={!!invalidBorrowerEmissionCap}
        helperText={invalidBorrowerEmissionCap}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionCap(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.borrowerEmissionFloor}
      >
        <p>
          <IconSpan>
            Borrower Emission Floor{' '}
            <InfoTooltip>Minimum per-block ANC emission rate</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={10}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={borrowerEmissionFloor}
        disabled={inputDisabled.borrowerEmissionFloor}
        InputProps={{
          endAdornment: <InputAdornment position="end">uANC</InputAdornment>,
        }}
        error={!!invalidBorrowerEmissionFloor}
        helperText={invalidBorrowerEmissionFloor}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionFloor(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.incrementMultiplier}
      >
        <p>
          <IconSpan>
            Increment Multiplier{' '}
            <InfoTooltip>Rate multiplier when increasing emission</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={incrementMultiplier}
        disabled={inputDisabled.incrementMultiplier}
        error={!!invalidIncrementMultiplier}
        helperText={invalidIncrementMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setIncrementMultiplier(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.decrementMultiplier}
      >
        <p>
          <IconSpan>
            Decrement Multiplier{' '}
            <InfoTooltip>Rate multiplier when decreasing emission</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={decrementMultiplier}
        disabled={inputDisabled.decrementMultiplier}
        error={!!invalidDecrementMultiplier}
        helperText={invalidDecrementMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setDecrementMultiplier(target.value)
        }
      />
    </PollCreateBase>
  );
}
