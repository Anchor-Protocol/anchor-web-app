import { Reward } from '../logics/useRewards';
import React from 'react';
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
      <p className="subtext">
        <IconSpan>
          ≈ {formatUSTWithPostfixUnits(demicrofy(rewardsAmountInUst))} UST
        </IconSpan>
      </p>
    </>
  );
};
