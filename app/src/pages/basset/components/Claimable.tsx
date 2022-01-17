import {
  useBAssetClaimableRewardsTotalQuery,
  useBLunaClaimableRewards,
  useBLunaWithdrawableAmount,
} from '@anchor-protocol/app-provider';
import { formatUTokenDecimal2 } from '@libs/formatter';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { horizontalRuler, verticalRuler } from '@libs/styled-neumorphism';
import { Luna, u, UST } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import { Sub } from 'components/Sub';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';

export interface ClaimableProps {
  className?: string;
}

function Component({ className }: ClaimableProps) {
  const { data: { claimableReward, rewardState } = {} } =
    useBLunaClaimableRewards();

  const { data: { total } = {} } = useBAssetClaimableRewardsTotalQuery();

  const { data: { withdrawableUnbonded: _withdrawableAmount } = {} } =
    useBLunaWithdrawableAmount();

  const claimableRewards = useMemo(
    () =>
      _claimableRewards(claimableReward, rewardState).plus(total ?? '0') as u<
        UST<Big>
      >,
    [claimableReward, rewardState, total],
  );

  const withdrawableLuna = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as u<Luna<Big>>,
    [_withdrawableAmount?.withdrawable],
  );

  return (
    <Section className={className}>
      <div>
        <div>
          <h2>CLAIMABLE REWARDS</h2>
          <p>
            <AnimateNumber format={formatUTokenDecimal2}>
              {claimableRewards}
            </AnimateNumber>{' '}
            <Sub>UST</Sub>
          </p>
        </div>
        <FlatButton component={Link} to="/basset/claim">
          Claim Rewards
        </FlatButton>
      </div>
      <hr />
      <div>
        <div>
          <h2>WITHDRAWABLE LUNA</h2>
          <p>
            <AnimateNumber format={formatUTokenDecimal2}>
              {withdrawableLuna}
            </AnimateNumber>{' '}
            <Sub>LUNA</Sub>
          </p>
        </div>
        <FlatButton component={Link} to="/basset/withdraw">
          Withdraw
        </FlatButton>
      </div>
    </Section>
  );
}

const hRuler = css`
  margin: 30px 0;

  ${({ theme }) =>
    horizontalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const vRuler = css`
  margin: 0 55px;

  ${({ theme }) =>
    verticalRuler({
      color: theme.sectionBackgroundColor,
      intensity: theme.intensity,
    })};
`;

const StyledComponent = styled(Component)`
  > .NeuSection-content {
    padding: 50px 40px;

    display: flex;

    > div {
      flex: 1;

      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 12px;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.3px;

        margin-bottom: 16px;

        word-break: keep-all;
        white-space: nowrap;
      }

      p {
        font-size: 32px;
        font-weight: normal;
        line-height: 1.2;

        word-break: keep-all;
        white-space: nowrap;

        sub {
          font-size: 18px;
          font-weight: 500;
        }
      }

      a {
        max-width: 200px;
        width: 100%;
      }
    }

    hr {
      ${vRuler};
    }
  }

  @media (max-width: 1000px) {
    > .NeuSection-content {
      padding: 40px 40px;

      flex-direction: column;

      hr {
        ${hRuler};
      }
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    > .NeuSection-content {
      > div {
        flex-direction: column;

        a {
          margin-top: 20px;
          max-width: unset;
        }
      }
    }
  }
`;

export const Claimable = fixHMR(StyledComponent);
