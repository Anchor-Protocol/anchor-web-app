import {
  useAnchorBank,
  useBLunaClaimableRewards,
  useBLunaWithdrawableAmount,
} from '@anchor-protocol/app-provider';
import { formatUST } from '@anchor-protocol/notation';
import { demicrofy, formatUToken } from '@libs/formatter';
import { Luna, u } from '@libs/types';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';

export function AssetCardContentBluna() {
  const { tokenBalances } = useAnchorBank();

  const { data: { withdrawableUnbonded: _withdrawableAmount } = {} } =
    useBLunaWithdrawableAmount();

  const { data: { claimableReward, rewardState } = {} } =
    useBLunaClaimableRewards();

  const claimableRewards = useMemo(
    () => _claimableRewards(claimableReward, rewardState),
    [claimableReward, rewardState],
  );

  const withdrawableLuna = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as u<Luna<Big>>,
    [_withdrawableAmount?.withdrawable],
  );

  return (
    <table>
      <tbody>
        <tr>
          <th>LUNA</th>
          <td>{formatUToken(tokenBalances.uLuna)}</td>
        </tr>
        <tr>
          <th>bLUNA</th>
          <td>{formatUToken(tokenBalances.ubLuna)}</td>
        </tr>
        <tr>
          <th>Withdrawable</th>
          <td>{formatUToken(withdrawableLuna)}</td>
        </tr>
        <tr>
          <th>Reward</th>
          <td>{formatUST(demicrofy(claimableRewards))}</td>
        </tr>
      </tbody>
    </table>
  );
}
