import { HumanAddr, u, UST } from '@libs/types';
import big, { Big } from 'big.js';
import { bAsset } from '@anchor-protocol/types';
import React, { useMemo } from 'react';
import { d2Formatter, formatUTokenDecimal2 } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { DoughnutChart } from 'pages/dashboard/components/DoughnutChart';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';
import {
  RewardBreakdown,
  RewardsBreakdown,
} from '../hooks/useRewardsBreakdown';

type ClaimableRewardsBreakdownProps = {
  rewardsBreakdown: RewardsBreakdown;
  className?: string;
};

type TokenMetadata = { [symbol: string]: { color: string } };

const tokenMetadataBySymbol: TokenMetadata = {
  bLuna: { color: '#4bdb4b' },
  bETH: { color: '#1f1f1f' },
};

const defaultRewardBreakdown = (symbol: string): RewardBreakdown => ({
  symbol: '???',
  tokenPriceUST: big(0) as u<UST<Big>>,
  tokenReward: big(0) as u<bAsset<Big>>,
  tokenRewardUST: big(0) as u<UST<Big>>,
  rewardAddr: '' as HumanAddr,
});

const Component = ({
  rewardsBreakdown,
  className,
}: ClaimableRewardsBreakdownProps) => {
  const rewardChartDescriptors = useMemo(() => {
    const rewardsBySymbol = rewardsBreakdown.rewardBreakdowns.reduce(
      (acc, curr) => ({ ...acc, [curr.symbol]: curr }),
      {} as { [k: string]: RewardBreakdown },
    );

    return Object.entries(tokenMetadataBySymbol).map(
      ([tokenSymbol, tokenMetadata]) => {
        const rewardBreakdown =
          tokenSymbol in rewardsBySymbol
            ? rewardsBySymbol[tokenSymbol]
            : defaultRewardBreakdown(tokenSymbol);

        return {
          value: Number(formatUTokenDecimal2(rewardBreakdown.tokenRewardUST)),
          label: rewardBreakdown.symbol,
          color: tokenMetadata.color,
        };
      },
    );
  }, [rewardsBreakdown]);

  return (
    <div className={className}>
      <div className="rewards">
        <div className="rewardsChart">
          <DoughnutChart descriptors={rewardChartDescriptors} />
        </div>
        <div className="rewardBreakdowns">
          {rewardChartDescriptors.map((descriptor) => (
            <div className="rewardBreakdown" key={descriptor.label}>
              <i style={{ backgroundColor: descriptor.color }} />
              <span className="rewardLabel">{descriptor.label}</span>
              <span className="rewardValue">
                <AnimateNumber format={d2Formatter}>
                  {descriptor.value}
                </AnimateNumber>{' '}
                UST
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  .rewards {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .rewardsChart {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }

    .rewardBreakdowns {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      margin-bottom: auto;
      margin-top: auto;

      .rewardBreakdown:not(:first-child) {
        margin-top: 5px;
      }

      .rewardBreakdown {
        display: flex;
        align-items: center;
        font-weight: 500;
        line-height: 1.5;

        .rewardLabel {
          color: ${({ theme }) => theme.dimTextColor};
          width: 45px;
        }

        .rewardValue {
          color: ${({ theme }) => theme.textColor};
        }

        i {
          background-color: currentColor;
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 3px;
          margin-right: 5px;
        }
      }
    }
  }
`;

export const ClaimableRewardsBreakdown = fixHMR(StyledComponent);
