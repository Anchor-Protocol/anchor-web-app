import { ExecuteMsg } from '@anchor-protocol/app-fns';
import { moneyMarket, Rate } from '@anchor-protocol/types';
import { useAnchorWebapp } from '@anchor-protocol/app-provider';
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

export function PollCreateModifyBorrowInterest() {
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
  const [baseBorrowRate, setBaseBorrowRate] = useState<string>('');
  const [interestMultiplier, setInterestMultiplier] = useState<string>('');

  const inputDisabled = useMemo(() => {
    if (baseBorrowRate.length > 0) {
      return {
        baseBorrowRate: false,
        interestMultiplier: true,
      };
    } else if (interestMultiplier.length > 0) {
      return {
        baseBorrowRate: true,
        interestMultiplier: false,
      };
    } else {
      return {
        baseBorrowRate: false,
        interestMultiplier: false,
      };
    }
  }, [baseBorrowRate.length, interestMultiplier.length]);

  const invalidBaseBorrowRate = useMemo(() => {
    if (baseBorrowRate.length === 0) return undefined;

    return big(baseBorrowRate).lt(1)
      ? 'Please input LTV between 1 ~ 99'
      : undefined;
  }, [baseBorrowRate]);

  const invalidInterestMultiplier = useMemo(() => {
    if (interestMultiplier.length === 0) return undefined;

    return big(interestMultiplier).gt(1) || big(interestMultiplier).lt(0)
      ? 'Interest Multiplier must be between 0 and 1'
      : undefined;
  }, [interestMultiplier]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (baseBorrowRate: string, interestMultiplier: string): ExecuteMsg[] => {
      const interestModelConfig: moneyMarket.interestModel.UpdateConfig['update_config'] =
        {};

      if (baseBorrowRate.length > 0) {
        interestModelConfig['base_rate'] = formatExecuteMsgNumber(
          big(baseBorrowRate).div(100).div(blocksPerYear),
        ) as Rate;
      }

      if (interestMultiplier.length > 0) {
        interestModelConfig['interest_multiplier'] = formatExecuteMsgNumber(
          interestMultiplier,
        ) as Rate;
      }

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (Object.keys(interestModelConfig).length > 0) {
        msgs.push({
          contract: address.moneyMarket.interestModel,
          msg: Buffer.from(
            JSON.stringify({
              update_config: interestModelConfig,
            }),
          ).toString('base64'),
        });
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.moneyMarket.interestModel, blocksPerYear],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify Borrow Interest"
      submitDisabled={
        (baseBorrowRate.length === 0 && interestMultiplier.length === 0) ||
        !!invalidBaseBorrowRate ||
        !!invalidInterestMultiplier
      }
      onCreateMsgs={() => createMsgs(baseBorrowRate, interestMultiplier)}
    >
      <div className="description" aria-disabled={inputDisabled.baseBorrowRate}>
        <p>
          <IconSpan>
            Base Borrow Rate{' '}
            <InfoTooltip>
              Minimum per-block interest rate to borrowers
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        type="integer"
        maxIntegerPoinsts={2}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={baseBorrowRate}
        disabled={inputDisabled.baseBorrowRate}
        error={!!invalidBaseBorrowRate}
        helperText={invalidBaseBorrowRate}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBaseBorrowRate(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.interestMultiplier}
      >
        <p>
          <IconSpan>
            Interest Multiplier{' '}
            <InfoTooltip>
              Multiplier between utilization ratio and per-block borrow rate
            </InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={1}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={interestMultiplier}
        disabled={inputDisabled.interestMultiplier}
        error={!!invalidInterestMultiplier}
        helperText={invalidInterestMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setInterestMultiplier(target.value)
        }
      />
    </PollCreateBase>
  );
}
