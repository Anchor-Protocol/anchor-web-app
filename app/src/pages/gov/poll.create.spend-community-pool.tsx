import { ExecuteMsg } from '@anchor-protocol/app-fns';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  formatANC,
} from '@anchor-protocol/notation';
import { ANC, anchorToken, HumanAddr, u } from '@anchor-protocol/types';
import {
  useAncBalanceQuery,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { demicrofy, microfy } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { AccAddress } from '@terra-money/terra.js';
import { PollCreateBase } from 'pages/gov/components/PollCreateBase';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

export function PollCreateSpendCommunityPool() {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { contractAddress: address } = useAnchorWebapp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const { data: { ancBalance: communityAncBalance } = {} } = useAncBalanceQuery(
    address.anchorToken.community,
  );

  const invalidAmount = useMemo(() => {
    if (amount.length === 0 || !communityAncBalance) {
      return undefined;
    }

    const uanc = microfy(amount as ANC);

    return uanc.gt(communityAncBalance.balance)
      ? 'Spending Limit Exceeded'
      : undefined;
  }, [amount, communityAncBalance]);

  const invalidRecipient = useMemo(() => {
    if (recipient.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(recipient) ? 'Invalid address' : undefined;
  }, [recipient]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsgs = useCallback(
    (recipient: string, amount: string): ExecuteMsg[] => {
      const spend: anchorToken.community.Spend['spend'] = {
        recipient: recipient as HumanAddr,
        amount: microfy(amount as ANC).toFixed() as u<ANC>,
      };

      const msgs: Omit<ExecuteMsg, 'order'>[] = [];

      if (Object.keys(spend).length > 0) {
        msgs.push({
          contract: address.anchorToken.community,
          msg: Buffer.from(
            JSON.stringify({
              spend,
            }),
          ).toString('base64'),
        });
      }

      return msgs.map((msg, i) => ({
        order: i + 1,
        ...msg,
      }));
    },
    [address.anchorToken.community],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      pollTitle="Spend Community Pool"
      submitDisabled={
        recipient.length === 0 ||
        amount.length === 0 ||
        !!invalidAmount ||
        !!invalidRecipient
      }
      onCreateMsgs={() => createMsgs(recipient, amount)}
    >
      <div className="description">
        <p>
          <IconSpan>
            Recipient <InfoTooltip>Grant recipient address</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <TextInput
        placeholder="Address"
        value={recipient}
        error={!!invalidRecipient}
        helperText={invalidRecipient}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setRecipient(target.value)
        }
      />

      <div className="description">
        <p>
          <IconSpan>
            Amount <InfoTooltip>Grant amount (in units of ANC)</InfoTooltip>
          </IconSpan>
        </p>
        <p />
      </div>

      <NumberInput
        placeholder="0.00"
        maxIntegerPoinsts={ANC_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={ANC_INPUT_MAXIMUM_DECIMAL_POINTS}
        value={amount}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
          setAmount(target.value)
        }
      />

      <div className="wallet" aria-invalid={!!invalidAmount}>
        <span>{invalidAmount}</span>
        <span>
          Max Spending Limit:{' '}
          <span>
            {communityAncBalance
              ? formatANC(demicrofy(communityAncBalance.balance))
              : 0}{' '}
            ANC
          </span>
        </span>
      </div>
    </PollCreateBase>
  );
}
