import { formatLuna } from '@anchor-protocol/notation';
import { demicrofy } from '@libs/formatter';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import {
  pressed,
  rulerLightColor,
  rulerShadowColor,
} from '@libs/styled-neumorphism';
import { fixHMR } from 'fix-hmr';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { WithdrawHistory as History } from '../logics/withdrawAllHistory';

const MAX_DATE = new Date(8640000000000000);
const MAX_ITEMS = 3;

export interface WithdrawHistoryProps {
  className?: string;
  withdrawHistory: History[] | undefined;
}

function WithdrawHistoryBase({
  className,
  withdrawHistory,
}: WithdrawHistoryProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000 * 10);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const history = useMemo(() => {
    const sorted = withdrawHistory?.slice().sort((a: History, b: History) => {
      return (
        (b.claimableTime ?? MAX_DATE).getTime() -
        (a.claimableTime ?? MAX_DATE).getTime()
      );
    });
    return sorted ?? [];
  }, [withdrawHistory]);

  const limit = expanded ? history.length : MAX_ITEMS;

  return (
    <div className={className}>
      <ul>
        {history
          .slice(0, limit)
          .map(
            (
              { blunaAmount, lunaAmount, requestTime, claimableTime },
              index,
            ) => {
              const status: 'PENDING' | 'UNBONDING' | 'WITHDRAWABLE' =
                !claimableTime
                  ? 'PENDING'
                  : claimableTime <= currentDate
                  ? 'WITHDRAWABLE'
                  : 'UNBONDING';

              return (
                <li key={`withdraw-history-${index}`} data-status={status}>
                  <h5>{status}</h5>
                  <div>
                    <p>{formatLuna(demicrofy(blunaAmount))} bLUNA</p>

                    {!!requestTime && status !== 'PENDING' ? (
                      <p>
                        Requested time:{' '}
                        <time>
                          {requestTime.toLocaleString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) +
                            ', ' +
                            requestTime.toLocaleTimeString('en-US')}
                        </time>
                      </p>
                    ) : (
                      <p>-</p>
                    )}

                    <p>
                      {lunaAmount
                        ? `${formatLuna(demicrofy(lunaAmount))} LUNA`
                        : ''}
                    </p>

                    {!!claimableTime && status !== 'PENDING' ? (
                      <p>
                        Claimable time:{' '}
                        <time>
                          {claimableTime.toLocaleString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) +
                            ', ' +
                            claimableTime.toLocaleTimeString('en-US')}
                        </time>
                      </p>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </li>
              );
            },
          )}
      </ul>
      {history.length > MAX_ITEMS && (
        <BorderButton onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show less' : 'Show more'}
        </BorderButton>
      )}
    </div>
  );
}

export const StyledWithdrawHistory = styled(WithdrawHistoryBase)`
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  ul {
    list-style: none;
    padding: 20px;

    border-radius: 5px;

    ${({ theme }) =>
      pressed({
        color: theme.selector.backgroundColor,
        distance: 0.3,
        intensity: theme.intensity,
      })};

    li {
      h5 {
        font-size: 12px;
        font-weight: 500;
        text-align: right;

        margin-bottom: 4px;
      }

      div {
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

      &[data-status='PENDING'] {
        h5 {
          color: var(--pending-color);
        }
      }

      &[data-status='UNBONDING'] {
        h5 {
          color: var(--unbonding-color);
        }
      }

      &[data-status='WITHDRAWABLE'] {
        h5 {
          color: var(--withdrawable-color);
        }
      }
    }
  }

  button {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 300px;
    align-self: center;
  }

  @media (max-width: 650px) {
    li {
      div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  }
`;

export const WithdrawHistory = fixHMR(StyledWithdrawHistory);
