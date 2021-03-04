import { ExecuteMsg } from '@anchor-protocol/anchor.js';
import { floor } from '@anchor-protocol/big-math';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { Rate } from '@anchor-protocol/types';
import { UpdateConfig as InterestModelUpdateConfig } from '@anchor-protocol/types/contracts/moneyMarket/interestModel/updateConfig';
import { InputAdornment } from '@material-ui/core';
import big from 'big.js';
import { useContractAddress } from 'contexts/contract';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useState } from 'react';

export function PollCreateModifyBorrowInterest() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const address = useContractAddress();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [baseBorrowRate, setBaseBorrowRate] = useState<string>('');
  const [interestMultiplier, setInterestMultiplier] = useState<string>('');

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (baseBorrowRate: string, interestMultiplier: string): ExecuteMsg[] => {
      const interestModelConfig: InterestModelUpdateConfig['update_config'] = {};

      if (interestMultiplier.length > 0) {
        interestModelConfig['base_rate'] = big(baseBorrowRate)
          .div(100)
          .toFixed() as Rate;
      }

      if (interestMultiplier.length > 0) {
        interestModelConfig['interest_multiplier'] = floor(
          big(interestMultiplier),
        ).toFixed() as Rate;
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
    [address.moneyMarket.interestModel],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Modify Borrow Interest"
      submitDisabled={
        baseBorrowRate.length === 0 && interestMultiplier.length === 0
      }
      onCreateMsgs={() => createMsgs(baseBorrowRate, interestMultiplier)}
    >
      <div className="description">
        <p>Base Borrow Rate</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={8}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        value={baseBorrowRate}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setBaseBorrowRate(target.value)
        }
      />

      <div className="description">
        <p>Interest Multiplier</p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={3}
        maxDecimalPoints={6}
        value={interestMultiplier}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setInterestMultiplier(target.value)
        }
      />
    </PollCreateBase>
  );
}
