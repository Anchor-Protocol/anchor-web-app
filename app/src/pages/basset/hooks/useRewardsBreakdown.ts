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
import { CW20TokenDisplayInfo, CW20TokenDisplayInfos } from '@libs/app-fns';
import { useCW20TokenDisplayInfosQuery } from '@libs/app-provider';
import { HumanAddr, u, UST } from '@libs/types';
import { useWallet } from '@terra-money/use-wallet';
import big from 'big.js';
import { useMemo } from 'react';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';

type BAssetClaimableRewardsPayload = [
  contract: HumanAddr,
  rewards: BAssetClaimableRewards,
];

export type RewardBreakdown = {
  tokenDisplay: CW20TokenDisplayInfo;
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
      tokenDisplay: b.tokenDisplay.anchor,
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
      rewardBreakdowns: rewardBreakdowns.filter((r) =>
        r.tokenRewardUST.gt(big(0)),
      ),
    };
  }, [bAssetBreakdown, bLunaBreakdown]);
};

export const useClaimableRewardsBreakdown = () => {
  const { data: { oraclePrices } = {} } = useBorrowMarketQuery();
  const { data: tokenDisplayInfos = {} } = useCW20TokenDisplayInfosQuery();

  return useRewardsBreakdown(oraclePrices?.prices ?? [], tokenDisplayInfos);
};
