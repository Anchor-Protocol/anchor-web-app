import { useBAssetClaimableRewardsQuery } from '@anchor-protocol/app-provider';
import { formatUST } from '@anchor-protocol/notation';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import { demicrofy, formatUToken } from '@libs/formatter';
import { CW20Addr, HumanAddr } from '@libs/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import React from 'react';

export interface AssetCardContentWormholeProps {
  bAssetTokenAddr: CW20Addr;
  whAssetTokenAddr: CW20Addr | null;
  bAssetSymbol: string;
  whAssetSymbol: string;
  rewardAddr: HumanAddr;
}

export function AssetCardContentWormhole({
  bAssetTokenAddr,
  whAssetTokenAddr,
  bAssetSymbol,
  whAssetSymbol,
  rewardAddr,
}: AssetCardContentWormholeProps) {
  const connectedWallet = useConnectedWallet();

  const bAssetBalance = useCW20Balance<bAsset>(
    bAssetTokenAddr,
    connectedWallet?.terraAddress,
  );
  const whAssetBalance = useCW20Balance<bAsset>(
    whAssetTokenAddr ?? undefined,
    connectedWallet?.terraAddress,
  );

  const { data: { claimableReward } = {} } =
    useBAssetClaimableRewardsQuery(rewardAddr);

  return (
    <table>
      <tbody>
        <tr>
          <th>{whAssetSymbol}</th>
          <td>{formatUToken(whAssetBalance)}</td>
        </tr>
        <tr>
          <th>{bAssetSymbol}</th>
          <td>{formatUToken(bAssetBalance)}</td>
        </tr>
        <tr>
          <th>Reward</th>
          <td>
            {claimableReward
              ? formatUST(demicrofy(claimableReward.rewards))
              : 0}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
