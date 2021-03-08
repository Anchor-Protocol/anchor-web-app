import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  formatExecuteMsgNumber,
  MAX_EXECUTE_MSG_DECIMALS,
} from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import { UpdateConfig as DistributionModelUpdateConfig } from '@anchor-protocol/types/contracts/moneyMarket/distributionModel/updateConfig';
import { useContractAddress } from 'contexts/contract';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useState } from 'react';

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
        borrowerEmissionCap.length === 0 &&
        borrowerEmissionFloor.length === 0 &&
        incrementMultiplier.length === 0 &&
        decrementMultiplier.length === 0
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
      <div className="description">
        <p>Borrower Emission Cap</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={borrowerEmissionCap}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionCap(target.value)
        }
      />

      <div className="description">
        <p>Borrower Emission Floor</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={borrowerEmissionFloor}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBorrowerEmissionFloor(target.value)
        }
      />

      <div className="description">
        <p>Increment Multiplier</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={incrementMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setIncrementMultiplier(target.value)
        }
      />

      <div className="description">
        <p>Decrement Multiplier</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={MAX_EXECUTE_MSG_DECIMALS}
        value={decrementMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setDecrementMultiplier(target.value)
        }
      />
    </PollCreateBase>
  );
}
