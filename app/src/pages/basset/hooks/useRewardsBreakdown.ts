import {
  BAssetClaimableRewards,
  BLunaClaimableRewards,
} from '@anchor-protocol/app-fns';
import {
  AnchorContractAddress,
  BAssetInfoWithDisplay,
  useAnchorWebapp,
  useBAssetClaimableRewardsTotalQuery,
  useBAssetInfoListQuery,
  useBLunaClaimableRewards,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import { bAsset, moneyMarket } from '@anchor-protocol/types';
import { HumanAddr, u, UST } from '@libs/types';
import big from 'big.js';
import { useMemo } from 'react';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';

type BAssetClaimableRewardsPayload = [
  contract: HumanAddr,
  rewards: BAssetClaimableRewards,
];

export type RewardBreakdown = {
  symbol: string;
  tokenRewardUST: u<UST<big>>;
  tokenReward: u<bAsset<big>>;
  tokenPriceUST: u<UST<big>>;
  rewardAddr: HumanAddr;
};

export type RewardsBreakdown = {
  totalRewardsUST: u<UST<big>>;
  rewardBreakdowns: RewardBreakdown[];
};

const bLunaRewardBreakdown = (
  oraclePrices: moneyMarket.oracle.PricesResponse['prices'],
  contractAddress: AnchorContractAddress,
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
    symbol: 'bLuna',
    tokenRewardUST,
    tokenPriceUST,
    tokenReward: (tokenPriceUST.gt(big(0))
      ? tokenRewardUST.div(tokenPriceUST)
      : big(0)) as u<bAsset<big>>,
    rewardAddr: contractAddress.bluna.reward,
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
      symbol: b.tokenDisplay?.anchor?.symbol ?? b.bAsset.symbol,
      tokenRewardUST,
      tokenPriceUST,
      tokenReward: (tokenPriceUST.gt(big(0))
        ? tokenRewardUST.div(tokenPriceUST)
        : big(0)) as u<bAsset<big>>,
      rewardAddr: b.custodyConfig.reward_contract,
    };
  });
};

const useRewardsBreakdown = (
  oraclePrices: moneyMarket.oracle.PricesResponse['prices'],
): RewardsBreakdown => {
  const { data: bAssetInfoList = [] } = useBAssetInfoListQuery();
  const { data: { rewards: bAssetRewards = [] } = {} } =
    useBAssetClaimableRewardsTotalQuery();

  const { contractAddress } = useAnchorWebapp();
  const { data: bLunaClaimableRewards } = useBLunaClaimableRewards();

  const bLunaBreakdown = useMemo(
    () =>
      bLunaRewardBreakdown(
        oraclePrices,
        contractAddress,
        bLunaClaimableRewards,
      ),
    [oraclePrices, contractAddress, bLunaClaimableRewards],
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
      rewardBreakdowns: rewardBreakdowns.filter((r) =>
        r.tokenRewardUST.gt(big(0)),
      ),
    };
  }, [bAssetBreakdown, bLunaBreakdown]);
};

export const useClaimableRewardsBreakdown = () => {
  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();

  return useRewardsBreakdown(oraclePrices?.prices ?? []);
};
