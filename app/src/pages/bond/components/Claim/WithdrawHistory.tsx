import { formatLuna } from '@anchor-protocol/notation';
import { demicrofy } from '@libs/formatter';
import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@libs/styled-neumorphism';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { WithdrawHistory as History } from '../../logics/withdrawAllHistory';

export interface WithdrawHistoryProps {
  className?: string;
  withdrawHistory: History[] | undefined;
}

function WithdrawHistoryBase({
  className,
  withdrawHistory,
}: WithdrawHistoryProps) {
  return (
    <ul className={className}>
      {withdrawHistory?.map(
        ({ blunaAmount, lunaAmount, requestTime, claimableTime }, index) => (
          <li key={`withdraw-history-${index}`}>
            <p>{formatLuna(demicrofy(blunaAmount))} bLUNA</p>
            <p>
              Requested time:{' '}
              <time>
                {requestTime
                  ? requestTime.toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }) +
                    ', ' +
                    requestTime.toLocaleTimeString('en-US')
                  : 'Pending'}
              </time>
            </p>
            <p>
              {lunaAmount ? `${formatLuna(demicrofy(lunaAmount))} LUNA` : ''}
            </p>
            <p>
              Claimable time:{' '}
              <time>
                {claimableTime
                  ? claimableTime.toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }) +
                    ', ' +
                    claimableTime.toLocaleTimeString('en-US')
                  : 'Pending'}
              </time>
            </p>
          </li>
        ),
      )}
    </ul>
  );
}

export const StyledWithdrawHistory = styled(WithdrawHistoryBase)`
  margin-top: 40px;

  max-height: 185px;
  overflow-y: auto;

  list-style: none;
  padding: 20px;

  border-radius: 5px;

  ${({ theme }) =>
    pressed({
      color: theme.selector.backgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(2, 1fr);
    justify-content: space-between;
    align-items: center;
    grid-gap: 5px;

    font-size: 12px;

    > :nth-child(odd) {
      color: ${({ theme }) => theme.textColor};
    }

    > :nth-child(even) {
      text-align: right;
      color: ${({ theme }) => theme.dimTextColor};
    }

    &:not(:last-child) {
      padding-bottom: 10px;

      border-bottom: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            color: theme.selector.backgroundColor,
            intensity: theme.intensity,
          })};
    }

    &:not(:first-child) {
      padding-top: 10px;

      border-top: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            color: theme.selector.backgroundColor,
            intensity: theme.intensity,
          })};
    }
  }

  @media (max-width: 650px) {
    li {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export const WithdrawHistory = fixHMR(StyledWithdrawHistory);
