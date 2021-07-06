import {
  AnimateNumber,
  formatRate,
  formatUSTWithPostfixUnits,
  formatUTokenDecimal2,
} from '@anchor-protocol/notation';
import { anc160gif, GifIcon, TokenIcon } from '@anchor-protocol/token-icons';
import { HumanAddr, Rate, uANC, UST, uToken } from '@anchor-protocol/types';
import {
  useAncBalanceQuery,
  useAnchorWebapp,
  useAncLpStakingStateQuery,
  useAncPriceQuery,
  useAncTokenInfoQuery,
  useBorrowAPYQuery,
  useGovStateQuery,
  useRewardsAnchorLpRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import { ChevronRight } from '@material-ui/icons';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import { TooltipLabel } from '@terra-dev/neumorphism-ui/components/TooltipLabel';
import big, { Big } from 'big.js';
import { Circles } from 'components/Circles';
import { screen } from 'env';
import { ancGovernancePathname, ancUstLpPathname } from 'pages/gov/env';
import React, { useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface OverviewProps {
  className?: string;
}

function OverviewBase({ className }: OverviewProps) {
  const { contractAddress } = useAnchorWebapp();

  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { data: { govRewards, lpRewards } = {} } = useBorrowAPYQuery();

  const { data: { anchorLpRewards: apyLPRewards } = {} } =
    useRewardsAnchorLpRewardsQuery();

  const history = useHistory();

  const { data: { ancTokenInfo } = {} } = useAncTokenInfoQuery();
  const { data: { ancBalance: govANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.gov,
  );
  const { data: { ancBalance: communityANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.community,
  );
  const { data: { ancBalance: distributorANCBalance } = {} } =
    useAncBalanceQuery(contractAddress.anchorToken.distributor);
  const { data: { ancBalance: lpStakingANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.staking,
  );
  const { data: { ancBalance: airdropANCBalance } = {} } = useAncBalanceQuery(
    'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm' as HumanAddr,
  );
  const { data: { ancBalance: investorTeamLockANCBalance } = {} } =
    useAncBalanceQuery(
      'terra1dp0taj85ruc299rkdvzp4z5pfg6z6swaed74e6' as HumanAddr,
    );
  const { data: { govState, govConfig } = {} } = useGovStateQuery();

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();

  const ancUstLpAprTooltip = useMemo(() => {
    let defaultTooltip = 'LP rewards APR';

    if (apyLPRewards && apyLPRewards.length > 0) {
      const apr = big(big(apyLPRewards[0].APY).div(365).plus(1))
        .pow(365)
        .minus(1) as Rate<Big>;

      return `${formatRate(apr).toString()}% (if compounded daily)`;
    }

    return defaultTooltip;
  }, [apyLPRewards]);

  const { totalStaked, totalStakedRate } = useMemo(() => {
    if (
      !ancTokenInfo ||
      !govANCBalance ||
      !communityANCBalance ||
      !distributorANCBalance ||
      !lpStakingANCBalance ||
      !airdropANCBalance ||
      !investorTeamLockANCBalance ||
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
      .minus(airdropANCBalance.balance)
      .minus(investorTeamLockANCBalance.balance);

    const totalStakedRate = big(totalStaked).div(
      currentTotalSupply,
    ) as Rate<Big>;

    return { totalStaked, totalStakedRate };
  }, [
    airdropANCBalance,
    ancTokenInfo,
    communityANCBalance,
    distributorANCBalance,
    govANCBalance,
    govConfig,
    govState,
    investorTeamLockANCBalance,
    lpStakingANCBalance,
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
            <InfoTooltip>
              Total quantity of ANC tokens staked to the governance contract
            </InfoTooltip>
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
          <GifIcon
            src={anc160gif}
            style={{ fontSize: '2em', borderRadius: '50%' }}
          />
        </Circles>
        <h2>Anchor (ANC)</h2>
        <div className="staking-apy">
          <TooltipLabel
            title="Annualized ANC staking return based on the ANC distribution and staking ratio"
            placement="top"
          >
            APR
          </TooltipLabel>
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
          <BorderButton component={Link} to={`/gov/trade`}>
            Trade ANC
          </BorderButton>
          <Tooltip
            title="Stake ANC to participate in governance voting or to obtain governance rewards"
            placement="top"
          >
            <BorderButton
              component={Link}
              to={`/gov/rewards/${ancGovernancePathname}/stake`}
            >
              Gov Stake
            </BorderButton>
          </Tooltip>
        </div>
      </Section>
      <Section
        className="lp"
        onClick={() => history.push(`/gov/rewards/${ancUstLpPathname}/provide`)}
      >
        <Circles backgroundColors={['#ffffff', '#2C2C2C']}>
          <TokenIcon token="ust" style={{ fontSize: '1.1em' }} />
          <GifIcon
            src={anc160gif}
            style={{ fontSize: '2em', borderRadius: '50%' }}
          />
        </Circles>
        <h2>
          <IconSpan>
            ANC-UST LP <ChevronRight />
          </IconSpan>
        </h2>
        <div className="lp-labels">
          <div>
            <TooltipLabel title={ancUstLpAprTooltip} placement="top">
              APR
            </TooltipLabel>
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
            <TooltipLabel
              title="Total quantity of ANC-UST LP tokens staked"
              placement="top"
            >
              Total Staked
            </TooltipLabel>
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
  .lp {
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.hoverBackgroundColor};
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
      font-weight: 700;

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
      font-weight: 700;

      a {
        font-weight: 700 !important;
      }
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

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .NeuSection-root {
      margin-bottom: 20px;

      .NeuSection-content {
        padding: 20px;
      }
    }

    .anc-price,
    .total-staked {
      div {
        font-size: 30px;

        sub {
          font-size: 14px;
        }
      }
    }

    .staking,
    .lp {
      .staking-buttons {
        margin-top: 44px;
      }

      .lp-labels {
        margin-top: 44px;
      }
    }
  }
`;
