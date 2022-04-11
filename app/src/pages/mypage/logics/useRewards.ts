import {
  useAncLpStakingStateQuery,
  useAncPriceQuery,
  useBorrowAPYQuery,
  useRewardsAncGovernanceRewardsQuery,
  useRewardsAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/app-provider';
import { ANC, u, UST, Token } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { useAssetPriceInUstQuery } from 'queries';
import { useMemo } from 'react';
import { sum } from '@libs/big-math';

export interface Reward {
  symbol: string;
  amount: u<Token>;
  amountInUst: u<UST<Big>>;
}

const getRewardAmountInUst = (amount: Reward['amount'], price: UST<string>) =>
  big(amount).mul(price) as u<UST<Big>>;

export function useRewards() {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { ancPrice } = {} } = useAncPriceQuery();
  const { data: astroPrice } = useAssetPriceInUstQuery('astro');

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();

  const { data: { userLPBalance, userLPPendingToken, userLPDeposit } = {} } =
    useRewardsAncUstLpRewardsQuery();

  const { data: { userANCBalance, userGovStakingInfo } = {} } =
    useRewardsAncGovernanceRewardsQuery();

  const { data: { borrowerInfo, marketState } = {} } =
    useRewardsClaimableUstBorrowRewardsQuery();

  const { data: { govRewards, lpRewards, borrowerDistributionAPYs } = {} } =
    useBorrowAPYQuery();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const ancUstLp = useMemo(() => {
    if (
      !ancPrice ||
      !astroPrice ||
      !lpStakingState ||
      !userLPPendingToken ||
      !userLPBalance ||
      !userLPDeposit
    ) {
      return undefined;
    }

    const totalUserLPHolding = big(userLPBalance.balance).plus(userLPDeposit);

    const LPValue = big(ancPrice.USTPoolSize)
      .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare)
      .mul(2) as u<UST<Big>>;

    const poolAssets = {
      anc: big(ancPrice.ANCPoolSize)
        .mul(userLPBalance.balance)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<ANC<Big>>,
      ust: big(ancPrice.USTPoolSize)
        .mul(userLPBalance.balance)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<UST<Big>>,
    };

    const withdrawableAssets = {
      anc: big(ancPrice.ANCPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<ANC<Big>>,
      ust: big(ancPrice.USTPoolSize)
        .mul(totalUserLPHolding)
        .div(ancPrice.LPShare === '0' ? 1 : ancPrice.LPShare) as u<UST<Big>>,
    };

    const staked = userLPDeposit;
    const stakedValue = big(staked).mul(LPValue) as u<UST<Big>>;

    const stakable = userLPBalance.balance;
    const stakableValue = big(stakable).mul(LPValue) as u<UST<Big>>;

    const ancReward = userLPPendingToken.pending_on_proxy as u<Token>;
    const astroReward = userLPPendingToken.pending as u<Token>;

    const rewards: Reward[] = [
      {
        symbol: 'ASTRO',
        amount: astroReward,
        amountInUst: getRewardAmountInUst(astroReward, astroPrice),
      },
    ];
    // ANC rewards are no longer being issued
    if (!big(ancReward).eq(0)) {
      rewards.push({
        symbol: 'ANC',
        amount: ancReward,
        amountInUst: getRewardAmountInUst(ancReward, ancPrice.ANCPrice),
      });
    }

    const rewardsAmountInUst = sum(
      ...rewards.map((reward) => reward.amountInUst),
    ) as u<UST<Big>>;

    return {
      withdrawableAssets,
      poolAssets,
      LPValue,
      staked,
      stakedValue,
      stakable,
      stakableValue,
      rewards,
      rewardsAmountInUst,
    };
  }, [
    ancPrice,
    astroPrice,
    lpStakingState,
    userLPBalance,
    userLPDeposit,
    userLPPendingToken,
  ]);

  const govGorvernance = useMemo(() => {
    if (!userGovStakingInfo || !userANCBalance || !ancPrice) {
      return undefined;
    }

    const staked = big(userGovStakingInfo.balance) as u<ANC<Big>>;
    const stakedValue = staked.mul(ancPrice.ANCPrice) as u<UST<Big>>;

    const stakable = big(userANCBalance.balance) as u<ANC<Big>>;
    const stakableValue = stakable.mul(ancPrice.ANCPrice) as u<UST<Big>>;

    return { staked, stakedValue, stakable, stakableValue };
  }, [userANCBalance, userGovStakingInfo, ancPrice]);

  const ustBorrow = useMemo(() => {
    if (!marketState || !borrowerInfo || !ancPrice) {
      return undefined;
    }

    const reward = big(borrowerInfo.pending_rewards) as u<ANC<Big>>;
    const rewardValue = reward.mul(ancPrice.ANCPrice) as u<UST<Big>>;

    return { reward, rewardValue };
  }, [borrowerInfo, marketState, ancPrice]);

  const rewards = useMemo(() => {
    if (!ustBorrow || !ancUstLp || !ancPrice) {
      return undefined;
    }

    const ancRewardFromLP = ancUstLp.rewards.find(
      ({ symbol }) => symbol === 'ANC',
    );

    const ancRewardAmount = big(ancRewardFromLP?.amount || 0)
      .plus(ustBorrow.reward)
      .toString() as u<Token>;

    const ancReward: Reward = {
      symbol: 'ANC',
      amount: ancRewardAmount,
      amountInUst: getRewardAmountInUst(ancRewardAmount, ancPrice.ANCPrice),
    };

    return [
      ancReward,
      ...ancUstLp.rewards.filter(({ symbol }) => symbol !== 'ANC'),
    ];
  }, [ancPrice, ancUstLp, ustBorrow]);

  const rewardsAmountInUst = useMemo(
    () =>
      rewards
        ? (sum(...rewards.map((reward) => reward.amountInUst)) as u<UST<Big>>)
        : undefined,
    [rewards],
  );

  return {
    ancPrice,
    govRewards,
    govGorvernance,
    ancUstLp,
    lpRewards,
    rewards,
    rewardsAmountInUst,
    borrowerDistributionAPYs,
    ustBorrow,
  };
}
