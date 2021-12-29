import {
  useBAssetClaimableRewardsTotalQuery,
  useBLunaClaimableRewards,
  useBLunaWithdrawableAmount,
} from '@anchor-protocol/app-provider';
import { formatUToken, formatUTokenDecimal2 } from '@libs/formatter';
import { Luna, u, UST } from '@libs/types';
import big, { Big } from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { claimableRewards as _claimableRewards } from '../../bond/logics/claimableRewards';

export interface ClaimableProps {
  className?: string;
}

function Component({ className }: ClaimableProps) {
  const { data: { claimableReward, rewardState } = {} } =
    useBLunaClaimableRewards();

  const { data: { total } = {} } = useBAssetClaimableRewardsTotalQuery();

  const { data: { withdrawableUnbonded: _withdrawableAmount } = {} } =
    useBLunaWithdrawableAmount();

  const claimableRewards = useMemo(
    () =>
      _claimableRewards(claimableReward, rewardState).plus(total ?? '0') as u<
        UST<Big>
      >,
    [claimableReward, rewardState, total],
  );

  const withdrawableLuna = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as u<Luna<Big>>,
    [_withdrawableAmount?.withdrawable],
  );

  return (
    <div className={className}>
      <ul>
        <li>
          claimable rewards: {formatUTokenDecimal2(claimableRewards)} UST{' '}
          <Link to="/basset/claim">Claim Rewards</Link>
        </li>
        <li>
          withdrawable luna: {formatUToken(withdrawableLuna)} Luna{' '}
          <Link to="/basset/withdraw">Withdraw</Link>
        </li>
      </ul>
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const Claimable = fixHMR(StyledComponent);
