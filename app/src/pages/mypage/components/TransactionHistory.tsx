import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import styled from 'styled-components';
import React from 'react';
import { screen } from 'env';
import { CallMade } from '@material-ui/icons';

export interface TransactionHistoryProps {
  className?: string;
}

function TransactionHistoryBase({ className }: TransactionHistoryProps) {
  return (
    <Section className={className}>
      <ul>
        {Array.from({ length: 20 }, (_, i) => (
          <li key={'txhistory' + i}>
            <div>
              <p>Bond</p>
              <p>
                Unbonded <strong>yyy bLUNA</strong> for{' '}
                <strong>xxx LUNA</strong>{' '}
                <sub>(completion time: 21.06.21 )</sub> <CallMade />
              </p>
            </div>
            <time>Mon, Apr 19, 2021, 18:01 PM</time>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export const StyledTransactionHistory = styled(TransactionHistoryBase)`
  ul {
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 12px 0;

    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.hoverBackgroundColor};
    }

    p:nth-child(1) {
      font-size: 13px;
      color: ${({ theme }) => theme.dimTextColor};
    }

    p:nth-child(2) {
      font-size: 14px;

      svg {
        color: ${({ theme }) => theme.dimTextColor};
        font-size: 1em;
        vertical-align: bottom;
      }
    }

    time {
      font-size: 12px;
      color: ${({ theme }) => theme.dimTextColor};
    }

    sub {
      color: ${({ theme }) => theme.dimTextColor};
      font-size: max(0.8em, 12px);
      vertical-align: unset;
    }

    &:not(:first-child) {
      border-top: 1px solid
        ${({ theme }) =>
          rulerLightColor({
            intensity: theme.intensity,
            color: theme.backgroundColor,
          })};
    }

    &:not(:last-child) {
      border-bottom: 1px solid
        ${({ theme }) =>
          rulerShadowColor({
            intensity: theme.intensity,
            color: theme.backgroundColor,
          })};
    }
  }

  @media (max-width: ${screen.tablet.max}px) {
    li {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;

      time {
        margin-top: 1ex;
      }
    }
  }
`;

export const TransactionHistory =
  process.env.NODE_ENV === 'production'
    ? StyledTransactionHistory
    : (props: TransactionHistoryProps) => (
        <StyledTransactionHistory {...props} />
      );
