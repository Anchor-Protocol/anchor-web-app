import {
  AnchorContractAddress,
  BAssetInfoWithDisplay,
  useAnchorWebapp,
  useBAssetClaimableRewardsTotalQuery,
  useBAssetInfoListQuery,
  useBLunaClaimableRewards,
  useBLunaWithdrawableAmount,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import { formatUTokenDecimal2 } from '@libs/formatter';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { horizontalRuler, verticalRuler } from '@libs/styled-neumorphism';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { HumanAddr, Luna, u, UST } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import big, { Big } from 'big.js';
import { Sub } from 'components/Sub';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';
import {
  BAssetClaimableRewards,
  BLunaClaimableRewards,
} from '@anchor-protocol/app-fns';
import { CW20TokenDisplayInfo, CW20TokenDisplayInfos } from '@libs/app-fns';
import { useCW20TokenDisplayInfosQuery } from '@libs/app-provider';
import { useWallet } from '@terra-money/use-wallet';
import { bAsset, moneyMarket } from '@anchor-protocol/types';

const Heading = (props: { title: string; tooltip: string }) => {
  const { title, tooltip } = props;
  return (
    <h2>
      <IconSpan>
        {title} <InfoTooltip>{tooltip}</InfoTooltip>
      </IconSpan>
    </h2>
  );
};

export interface ClaimableProps {
  className?: string;
}

type BAssetClaimableRewardsPayload = [
  contract: HumanAddr,
  rewards: BAssetClaimableRewards,
];

type RewardBreakdown = {
  tokenDisplay: CW20TokenDisplayInfo;
  tokenRewardUST: u<UST<big>>;
  tokenReward: u<bAsset<big>>;
  tokenPriceUST: u<UST<big>>;
};

type RewardsBreakdown = {
  totalRewardsUST: u<UST<big>>;
  rewardBreakdowns: RewardBreakdown[];
};

const bLunaRewardBreakdown = (
  oraclePrices: moneyMarket.oracle.PricesResponse['prices'],
  contractAddress: AnchorContractAddress,
  tokenDisplayInfos: { [addr: string]: CW20TokenDisplayInfo },
  claimableRewards?: BLunaClaimableRewards,
): RewardBreakdown => {
  const tokenPriceUST = big(
    oraclePrices.find((p) => p.asset === contractAddress.cw20.bLuna)?.price ??
      0,
  ) as u<UST<big>>;

  const tokenRewardUST = _claimableRewards(
    claimableRewards?.claimableReward,
    claimableRewards?.rewardState,
  );

  return {
    tokenDisplay: tokenDisplayInfos[contractAddress.cw20.bLuna],
    tokenRewardUST,
    tokenPriceUST,
    tokenReward: (!tokenPriceUST.eq(big(0))
      ? tokenRewardUST.div(tokenPriceUST)
      : big(0)) as u<bAsset<big>>,
  };
};

const bAssetRewardsBreakdown = (
  oraclePrices: moneyMarket.oracle.PricesResponse['prices'],
  bAssetInfoList: BAssetInfoWithDisplay[],
  bAssetRewards: BAssetClaimableRewardsPayload[],
): RewardBreakdown[] => {
  return bAssetInfoList.map((b) => {
    const rewardPayload = bAssetRewards.find(
      (r) => r[0] === b.custodyConfig.reward_contract,
    );

    const tokenRewardUST = big(
      rewardPayload ? rewardPayload[1].claimableReward.rewards : 0,
    ) as u<UST<big>>;

    const tokenPriceUST = big(
      oraclePrices.find((p) => p.asset === b.bAsset.collateral_token)?.price ??
        0,
    ) as u<UST<big>>;

    return {
      tokenDisplay: b.tokenDisplay.anchor,
      tokenRewardUST,
      tokenPriceUST,
      tokenReward: (!tokenPriceUST.eq(0)
        ? tokenRewardUST.div(tokenPriceUST)
        : big(0)) as u<bAsset<big>>,
    };
  });
};

const useRewardsBreakdown = (
  oraclePrices: moneyMarket.oracle.PricesResponse['prices'],
  tokenDisplayInfos: CW20TokenDisplayInfos,
): RewardsBreakdown => {
  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();
  const { data: { rewards: bAssetRewards = [] } = {} } =
    useBAssetClaimableRewardsTotalQuery();

  const { network } = useWallet();
  const { contractAddress } = useAnchorWebapp();
  const { data: bLunaClaimableRewards } = useBLunaClaimableRewards();

  const bLunaBreakdown = useMemo(
    () =>
      bLunaRewardBreakdown(
        oraclePrices,
        contractAddress,
        tokenDisplayInfos[network.name] ?? {},
        bLunaClaimableRewards,
      ),
    [
      oraclePrices,
      contractAddress,
      tokenDisplayInfos,
      network,
      bLunaClaimableRewards,
    ],
  );

  const bAssetBreakdown = useMemo(
    () => bAssetRewardsBreakdown(oraclePrices, bAssetInfoList, bAssetRewards),
    [oraclePrices, bAssetInfoList, bAssetRewards],
  );

  return useMemo(() => {
    const rewardBreakdowns = [bLunaBreakdown, ...bAssetBreakdown];

    return {
      totalRewardsUST: rewardBreakdowns
        .map((r) => r.tokenRewardUST)
        .reduce((acc, curr) => acc.plus(curr), big(0)) as u<UST<big>>,
      rewardBreakdowns: rewardBreakdowns.filter(
        (r) => r.tokenRewardUST.toString() !== '0',
      ),
    };
  }, [bAssetBreakdown, bLunaBreakdown]);
};

function Component({ className }: ClaimableProps) {
  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();
  const { data: tokenDisplayInfos = {} } = useCW20TokenDisplayInfosQuery();

  const rewardsBreakdown = useRewardsBreakdown(
    oraclePrices?.prices ?? [],
    tokenDisplayInfos,
  );

  const { data: { withdrawableUnbonded: _withdrawableAmount } = {} } =
    useBLunaWithdrawableAmount();

  const withdrawableLuna = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as u<Luna<Big>>,
    [_withdrawableAmount?.withdrawable],
  );

  return (
    <Section className={className}>
      <div>
        <div>
          <Heading
            title="CLAIMABLE REWARDS"
            tooltip="Claim staking rewards from minted bAssets that have not been provided as collateral. If the user’s claimable reward is smaller than the tx fee, the rewards are not claimable."
          />
          <p>
            <AnimateNumber format={formatUTokenDecimal2}>
              {rewardsBreakdown.totalRewardsUST}
            </AnimateNumber>{' '}
            <Sub>UST</Sub>
          </p>
          <div className="rewardBreakdowns">
            {rewardsBreakdown.rewardBreakdowns.map((rewardBreakdown) => (
              <div
                className="rewardBreakdown"
                key={rewardBreakdown.tokenDisplay.symbol}
              >
                <div className="tokenReward">
                  {formatUTokenDecimal2(rewardBreakdown.tokenReward)}{' '}
                  {rewardBreakdown.tokenDisplay.symbol}
                </div>
                <div className="ustReward">
                  ≈ {formatUTokenDecimal2(rewardBreakdown.tokenRewardUST)} UST
                </div>
              </div>
            ))}
          </div>
        </div>
        <FlatButton component={Link} to="/basset/claim">
          Claim Rewards
        </FlatButton>
      </div>
      <hr />
      <div>
        <div>
          <Heading
            title="WITHDRAWABLE LUNA"
            tooltip="bLuna that has been burned and has surpassed the undelegation period can be withdrawn. Because burn requests are processed in 3-day batches, requests that are not yet included in a batch are shown as pending."
          />
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
  .rewardBreakdowns {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;

    .rewardBreakdown {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-top: 5px;
      font-size: 14px;

      .tokenReward {
        padding-right: 10px;
        color: gray;
      }

      .ustReward {
        color: gray;
      }
    }
  }

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
