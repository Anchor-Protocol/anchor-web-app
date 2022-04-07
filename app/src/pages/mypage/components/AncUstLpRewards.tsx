import { Reward } from '../logics/useRewards';
import React from 'react';
import { formatOutput } from '@anchor-protocol/formatter';
import { demicrofy } from '@libs/formatter';
import { u, UST } from '@anchor-protocol/types';
import { Big } from 'big.js';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { SumOfTokens } from 'components/SumOfTokens';

interface AncUstLpRewardsProps {
  rewards: Reward[];
  rewardsAmountInUst: u<UST<Big>>;
}

export const AncUstLpRewards = ({
  rewards,
  rewardsAmountInUst,
}: AncUstLpRewardsProps) => {
  return (
    <>
      <SumOfTokens tokens={rewards} />
      <p>
        {rewards
          .map(
            (reward) =>
              `${formatOutput(demicrofy(reward.amount))} ${reward.symbol}`,
          )
          .join(' + ')}
      </p>
      <p className="subtext">
        <IconSpan>
          ≈ {formatUSTWithPostfixUnits(demicrofy(rewardsAmountInUst))} UST
        </IconSpan>
      </p>
    </>
  );
};
