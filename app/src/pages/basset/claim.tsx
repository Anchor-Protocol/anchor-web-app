import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ClaimSection } from './components/ClaimSection';
import { WithdrawSection } from './components/WithdrawSection';

export interface ClaimProps {
  className?: string;
}

function ClaimBase({ className }: ClaimProps) {
  const [withdrawInProgress, setWithdrawInProgress] = useState<boolean>(false);
  const [claimInProgress, setClaimInProgress] = useState<boolean>(false);

  return (
    <div className={className}>
      <WithdrawSection
        disabled={claimInProgress}
        onProgress={setWithdrawInProgress}
      />
      <ClaimSection
        disabled={withdrawInProgress}
        onProgress={setClaimInProgress}
      />
    </div>
  );
}

export const Claim = styled(ClaimBase)`
  > section {
    margin-bottom: 40px;
  }

  .bond {
    width: 100%;
    margin-bottom: 60px;
  }

  .withdrawable-amount,
  .claimable-rewards {
    text-align: center;

    h4 {
      font-size: 14px;
      font-weight: 300;
      color: ${({ theme }) => theme.dimTextColor};
      margin-bottom: 5px;
    }

    p {
      font-size: 48px;
      font-weight: 300;
      color: ${({ theme }) => theme.textColor};
    }

    margin-bottom: 30px;
  }

  .submit {
    width: 100%;
    height: 60px;
  }

  .withdraw-history {
    margin-top: 40px;

    max-height: 185px;
    overflow-y: auto;

    list-style: none;
    padding: 20px;

    border-radius: 5px;

    ${({ theme }) =>
      pressed({
        color: theme.backgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })};

    li {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      justify-content: space-between;
      align-items: center;
      grid-gap: 5px;

      font-size: 12px;

      > :nth-child(odd) {
        color: ${({ theme }) => theme.dimTextColor};
      }

      > :nth-child(even) {
        text-align: right;
        color: ${({ theme }) => theme.textColor};
      }

      &:not(:last-child) {
        padding-bottom: 10px;

        border-bottom: 1px solid
          ${({ theme }) =>
            rulerShadowColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }

      &:not(:first-child) {
        padding-top: 10px;

        border-top: 1px solid
          ${({ theme }) =>
            rulerLightColor({
              color: theme.backgroundColor,
              intensity: theme.intensity,
            })};
      }
    }
  }
`;
