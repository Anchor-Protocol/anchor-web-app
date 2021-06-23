import { MypageTxHistory } from '@anchor-protocol/webapp-fns';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import { useWallet } from '@terra-money/wallet-provider';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface TransactionHistoryListProps {
  className?: string;
  history: MypageTxHistory[];
  breakpoint?: number;
}

function TransactionHistoryListBase({
  className,
  history,
  breakpoint = 700,
}: TransactionHistoryListProps) {
  const { ref, width = 1000 } = useResizeObserver();
  const { network } = useWallet();

  return (
    <ul className={className} ref={ref} data-break={width < breakpoint}>
      {history.map(({ descriptions, timestamp, tx_hash, tx_type }) => {
        const datetime = new Date(timestamp);
        return (
          <li key={'txhistory' + tx_hash}>
            <a
              href={`https://finder.terra.money/${network.chainID}/tx/${tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <p>{tx_type}</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: descriptions.join('<br/>'),
                  }}
                />
              </div>
              <time>
                {datetime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {', '}
                <span className="time">
                  {datetime.toLocaleTimeString('en-US')}
                </span>
              </time>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

const enter = keyframes`
  0% {
    opacity: 0;
  }
  
  100% {
    opacity: 1;
  }
`;

export const StyledTransactionHistoryList = styled(TransactionHistoryListBase)`
  padding: 0;
  list-style: none;

  letter-spacing: -0.03em;

  li {
    animation: ${enter} 0.3s ease-in-out;

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

    > a {
      text-decoration: none;
      color: ${({ theme }) => theme.textColor};

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

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

        word-break: break-all;
        white-space: break-spaces;

        svg {
          color: ${({ theme }) => theme.dimTextColor};
          font-size: 1em;
          vertical-align: bottom;
        }
      }

      time {
        font-size: 12px;
        color: ${({ theme }) => theme.dimTextColor};

        word-break: keep-all;
        white-space: nowrap;
      }

      sub {
        color: ${({ theme }) => theme.dimTextColor};
        font-size: max(0.8em, 12px);
        vertical-align: unset;
      }
    }
  }

  &[data-break='true'] {
    li {
      > a {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        time {
          margin-top: 1ex;
        }
      }
    }
  }
`;

export const TransactionHistoryList = StyledTransactionHistoryList;
