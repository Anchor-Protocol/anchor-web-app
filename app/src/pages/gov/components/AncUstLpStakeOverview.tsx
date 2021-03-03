import { Label } from '@anchor-protocol/neumorphism-ui/components/Label';
import { demicrofy, formatANC, formatLP } from '@anchor-protocol/notation';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { uANC, uAncUstLP } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import styled from 'styled-components';

export interface AncUstLpStakeOverviewProps {
  className?: string;
  stakable?: uAncUstLP<BigSource>;
  staked?: uAncUstLP<BigSource>;
  reward?: uANC<BigSource>;
}

function AncUstLpStakeOverviewBase({
  className,
  stakable,
  staked,
  reward,
}: AncUstLpStakeOverviewProps) {
  return (
    <ul className={className}>
      <li>
        <Label>Stakable</Label>
        <p>
          <s>{stakable ? formatLP(demicrofy(stakable)) : 0} LP</s>
        </p>
      </li>
      <li>
        <Label>Staked</Label>
        <p>
          <s>{staked ? formatLP(demicrofy(staked)) : 0} LP</s>
        </p>
      </li>
      <li>
        <Label>Reward</Label>
        <p>
          <s>{reward ? formatANC(demicrofy(reward)) : 0} ANC</s>
        </p>
      </li>
    </ul>
  );
}

export const AncUstLpStakeOverview = styled(AncUstLpStakeOverviewBase)`
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 88px;

  li {
    display: grid;
    place-content: center;
    text-align: center;

    span {
      width: 112px;
      margin-bottom: 10px;
    }

    p {
      color: ${({ theme }) => theme.textColor};

      font-size: 18px;
      font-weight: 500;
    }

    &:not(:last-child) {
      border-right: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            intensity: theme.intensity,
            color: theme.backgroundColor,
          })};
    }

    &:not(:first-child) {
      border-left: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            intensity: theme.intensity,
            color: theme.backgroundColor,
          })};
    }
  }

  margin-bottom: 56px;
`;
