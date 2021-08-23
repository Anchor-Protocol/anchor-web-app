import { ANC, u, UST } from '@anchor-protocol/types';
import {
  useAncLpStakingStateQuery,
  useAncPriceQuery,
  useBorrowAPYQuery,
  useRewardsAncGovernanceRewardsQuery,
  useRewardsClaimableAncUstLpRewardsQuery,
  useRewardsClaimableUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-provider';
import big, { Big } from 'big.js';
import { useMemo } from 'react';

export function useRewards() {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { ancPrice } = {} } = useAncPriceQuery();

  const { data: { lpStakingState } = {} } = useAncLpStakingStateQuery();

  const {
    data: { lPBalance: userLPBalance, lPStakerInfo: userLPStakingInfo } = {},
  } = useRewardsClaimableAncUstLpRewardsQuery();

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
    if (!ancPrice || !lpStakingState || !userLPStakingInfo || !userLPBalance) {
      return undefined;
    }

    const totalUserLPHolding = big(userLPBalance.balance).plus(
      userLPStakingInfo.bond_amount,
    );

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

    const staked = userLPStakingInfo.bond_amount;
    const stakedValue = big(staked).mul(LPValue) as u<UST<Big>>;

    const stakable = userLPBalance.balance;
    const stakableValue = big(stakable).mul(LPValue) as u<UST<Big>>;

    const reward = userLPStakingInfo.pending_reward;
    const rewardValue = big(reward).mul(ancPrice.ANCPrice) as u<UST<Big>>;

    return {
      withdrawableAssets,
      poolAssets,
      LPValue,
      staked,
      stakedValue,
      stakable,
      stakableValue,
      reward,
      rewardValue,
    };
  }, [ancPrice, lpStakingState, userLPBalance, userLPStakingInfo]);

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

  const total = useMemo(() => {
    if (!ustBorrow || !ancUstLp || !ancPrice) {
      return undefined;
    }

    const reward = ustBorrow.reward.plus(ancUstLp.reward) as u<ANC<Big>>;
    const rewardValue = reward.mul(ancPrice.ANCPrice) as u<UST<Big>>;

    return { reward, rewardValue };
  }, [ancPrice, ancUstLp, ustBorrow]);

  return {
    ancPrice,
    govRewards,
    govGorvernance,
    ancUstLp,
    lpRewards,
    total,
    borrowerDistributionAPYs,
    ustBorrow,
  };
}
