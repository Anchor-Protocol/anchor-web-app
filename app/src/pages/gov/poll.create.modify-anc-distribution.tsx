import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  formatExecuteMsgNumber,
  MAX_EXECUTE_MSG_DECIMALS,
} from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import { UpdateConfig as DistributionModelUpdateConfig } from '@anchor-protocol/types/contracts/moneyMarket/distributionModel/updateConfig';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateModifyANCDistribution() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const address = useContractAddress();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [borrowerEmissionCap, setBorrowerEmissionCap] = useState<string>('');
  const [borrowerEmissionFloor, setBorrowerEmissionFloor] = useState<string>(
    '',
  );
  const [incrementMultiplier, setIncrementMultiplier] = useState<string>('');
  const [decrementMultiplier, setDecrementMultiplier] = useState<string>('');

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
      const distributionModelConfig: DistributionModelUpdateConfig['update_config'] = {};

      if (borrowerEmissionCap.length > 0) {
        distributionModelConfig['emission_cap'] = formatExecuteMsgNumber(
          borrowerEmissionCap,
        ) as Rate;
      }

      if (borrowerEmissionFloor.length > 0) {
        distributionModelConfig['emission_floor'] = formatExecuteMsgNumber(
          borrowerEmissionFloor,
        ) as Rate;
      }

      if (incrementMultiplier.length > 0) {
        distributionModelConfig[
          'increment_multiplier'
        ] = formatExecuteMsgNumber(incrementMultiplier) as Rate;
      }

      if (decrementMultiplier.length > 0) {
        distributionModelConfig[
          'decrement_multiplier'
        ] = formatExecuteMsgNumber(decrementMultiplier) as Rate;
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
        <p>Borrower Emission Cap</p>
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
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionCap(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.borrowerEmissionFloor}
      >
        <p>Borrower Emission Floor</p>
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
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionFloor(target.value)
        }
      />

      <div
        className="description"
        aria-disabled={inputDisabled.incrementMultiplier}
      >
        <p>Increment Multiplier</p>
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
        <p>Decrement Multiplier</p>
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
