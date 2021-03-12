import { AnchorNoCircle } from '@anchor-protocol/icons';
import {
  AnimateNumber,
  formatRate,
  formatUSTWithPostfixUnits,
  formatUTokenDecimal2,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Rate, uANC, UST, uToken } from '@anchor-protocol/types';
import { ChevronRight } from '@material-ui/icons';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Label } from '@terra-dev/neumorphism-ui/components/Label';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { TextButton } from '@terra-dev/neumorphism-ui/components/TextButton';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import big, { Big } from 'big.js';
import { Circles } from 'components/Circles';
import { screen } from 'env';
import { useBorrowAPY } from 'pages/borrow/queries/borrowAPY';
import {
  ancGovernancePathname,
  ancUstLpPathname,
  govPathname,
} from 'pages/gov/env';
import { useANCPrice } from 'pages/gov/queries/ancPrice';
import { useLPStakingState } from 'pages/gov/queries/lpStakingState';
import { useTotalStakedMain } from 'pages/gov/queries/totalStakedMain';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  const {
    data: { ancPrice },
  } = useANCPrice();

  const {
    data: { govRewards, lpRewards },
  } = useBorrowAPY();

  const {
    data: {
      ancTokenInfo,
      govANCBalance,
      communityANCBalance,
      distributorANCBalance,
      lpStakingANCBalance,
      investorLockANCBalance,
      teamLockANCBalance,
      govState,
      govConfig,
    },
  } = useTotalStakedMain();

  const {
    data: { lpStakingState },
  } = useLPStakingState();

  const { totalStaked, totalStakedRate } = useMemo(() => {
    if (
      !ancTokenInfo ||
      !govANCBalance ||
      !communityANCBalance ||
      !distributorANCBalance ||
      !lpStakingANCBalance ||
      !investorLockANCBalance ||
      !teamLockANCBalance ||
      !govState ||
      !govConfig
    ) {
      return {
        totalStaked: big(0) as uANC<Big>,
        totalStakedRate: big(0) as Rate<Big>,
      };
    }

    const totalStaked = big(govANCBalance.balance).minus(
      govState.total_deposit,
    ) as uANC<Big>;

    const currentTotalSupply = big(ancTokenInfo.total_supply)
      .minus(communityANCBalance.balance)
      .minus(distributorANCBalance.balance)
      .minus(lpStakingANCBalance.balance)
      .minus(investorLockANCBalance.balance)
      .minus(teamLockANCBalance.balance);

    const totalStakedRate = big(totalStaked).div(
      currentTotalSupply,
    ) as Rate<Big>;

    return { totalStaked, totalStakedRate };
  }, [
    ancTokenInfo,
    communityANCBalance,
    distributorANCBalance,
    govANCBalance,
    govConfig,
    govState,
    investorLockANCBalance,
    lpStakingANCBalance,
    teamLockANCBalance,
  ]);

  return (
    <div className={className}>
      <Section className="anc-price">
        <h2>
          <IconSpan>
            ANC PRICE{' '}
            <InfoTooltip>
              Terraswap price of ANC that is determined by the current pool
              ratio
            </InfoTooltip>
          </IconSpan>
        </h2>
        <div>
          <AnimateNumber format={formatUSTWithPostfixUnits}>
            {ancPrice?.ANCPrice ?? ('0' as UST)}
          </AnimateNumber>{' '}
          UST
        </div>
      </Section>
      <Section className="total-staked">
        <h2>
          <IconSpan>
            TOTAL STAKED{' '}
            <InfoTooltip>Total quantity of ANC tokens staked</InfoTooltip>
          </IconSpan>
        </h2>
        <div>
          <AnimateNumber format={formatUTokenDecimal2}>
            {totalStaked}
          </AnimateNumber>{' '}
          ANC{' '}
          <sub>
            (
            <AnimateNumber format={formatRate}>{totalStakedRate}</AnimateNumber>
            %)
          </sub>
        </div>
      </Section>
      <Section className="staking">
        <Circles backgroundColors={['#2C2C2C']}>
          <AnchorNoCircle style={{ fontSize: '1.4em' }} />
        </Circles>
        <h2>Anchor (ANC)</h2>
        <div className="staking-apy">
          <Tooltip title="Governance Rewards APY" placement="top">
            <Label>APY</Label>
          </Tooltip>
          <span style={{ display: 'inline-block', minWidth: 80 }}>
            <AnimateNumber format={formatRate}>
              {govRewards && govRewards.length > 0
                ? govRewards[0].CurrentAPY
                : (0 as Rate<number>)}
            </AnimateNumber>{' '}
            %
          </span>
        </div>
        <div className="staking-buttons">
          <BorderButton component={Link} to={`/${govPathname}/trade`}>
            Trade ANC
          </BorderButton>
          <Tooltip
            title="Stake ANC to participate in governance voting or to obtain governance rewards"
            placement="top"
          >
            <BorderButton
              component={Link}
              to={`/${govPathname}/rewards/${ancGovernancePathname}/stake`}
            >
              Gov Stake
            </BorderButton>
          </Tooltip>
        </div>
      </Section>
      <Section className="lp">
        <Circles backgroundColors={['#ffffff', '#2C2C2C']}>
          <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
          <AnchorNoCircle style={{ fontSize: '1.4em' }} />
        </Circles>
        <h2>
          <TextButton
            component={Link}
            to={`/${govPathname}/rewards/${ancUstLpPathname}/provide`}
            style={{ width: 200, height: 28, fontSize: 18, fontWeight: 500 }}
          >
            <IconSpan>
              ANC - UST LP <ChevronRight />
            </IconSpan>
          </TextButton>
        </h2>
        <div className="lp-labels">
          <div>
            <Tooltip title="LP rewards APY" placement="top">
              <Label>APY</Label>
            </Tooltip>
            <p>
              <AnimateNumber format={formatRate}>
                {lpRewards && lpRewards.length > 0
                  ? lpRewards[0].APY
                  : (0 as Rate<number>)}
              </AnimateNumber>{' '}
              %
            </p>
          </div>
          <div>
            <Tooltip
              title="Total quantity of ANC - UST LP tokens staked"
              placement="top"
            >
              <Label>Total Staked</Label>
            </Tooltip>
            <p>
              <AnimateNumber format={formatUTokenDecimal2}>
                {lpStakingState?.total_bond_amount
                  ? lpStakingState.total_bond_amount
                  : (0 as uToken<number>)}
              </AnimateNumber>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  // ---------------------------------------------
  // styles
  // ---------------------------------------------
  .lp {
    a {
      text-decoration: none;
      color: ${({ theme }) => theme.textColor};
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .anc-price,
  .total-staked {
    display: grid;
    align-items: center;

    .NeuSection-content {
      padding: 40px;
    }

    h2 {
      font-size: 13px;
      font-weight: 500;

      margin-bottom: 10px;
    }

    div {
      font-size: 36px;
      font-weight: 300;

      sub {
        font-size: 18px;
        vertical-align: middle;
        color: ${({ theme }) => theme.dimTextColor};
      }
    }
  }

  .staking,
  .lp {
    text-align: center;

    .NeuSection-content {
      padding: 90px 40px 40px 40px;
    }

    h2 {
      margin-top: 15px;

      font-size: 18px;
      font-weight: 500;
    }

    .staking-apy {
      margin-top: 15px;

      display: flex;
      justify-content: center;
      align-items: center;

      > :first-child {
        margin-right: 10px;
      }
    }

    .staking-buttons {
      margin-top: 84px;

      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
    }

    .lp-labels {
      margin-top: 84px;

      display: flex;
      justify-content: space-evenly;

      > div {
        > :first-child {
          padding: 5px;
          width: 110px;
          margin-bottom: 5px;
        }

        > :last-child {
          font-size: 18px;
        }
      }
    }
  }

  @media (min-width: 1000px) and (max-width: ${screen.pc.max}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 200px);
    grid-gap: 40px;

    .anc-price {
      grid-column: 1;
      grid-row: 1;
    }

    .total-staked {
      grid-column: 2;
      grid-row: 1;
    }

    .staking {
      grid-column: 1;
      grid-row: 2/4;
    }

    .lp {
      grid-column: 2;
      grid-row: 2/4;
    }
  }

  @media (min-width: ${screen.monitor.min}px) {
    .NeuSection-root {
      margin-bottom: 0;
    }

    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 200px);
    grid-gap: 40px;

    .anc-price {
      grid-column: 1;
      grid-row: 1;
    }

    .total-staked {
      grid-column: 1;
      grid-row: 2;
    }

    .staking {
      grid-column: 2;
      grid-row: 1/3;
    }

    .lp {
      grid-column: 3;
      grid-row: 1/3;
    }
  }
`;
