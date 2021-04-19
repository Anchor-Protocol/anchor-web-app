import { demicrofy, formatLuna } from '@anchor-protocol/notation';
import { HumanAddr, uLuna } from '@anchor-protocol/types';
import { AccountLink } from 'components/AccountLink';
import React from 'react';
import styled from 'styled-components';

export interface AnnouncementProps {
  className?: string;
  address: HumanAddr;
  minterAmount: uLuna | undefined;
  burnAmount: uLuna | undefined;
}

function AnnouncementBase({
  className,
  address,
  minterAmount,
  burnAmount,
}: AnnouncementProps) {
  return (
    <article className={className}>
      <h2>Announcement of bLuna burn incident</h2>
      <p>
        Details :{' '}
        <a href="https://google.com" target="_blank" rel="noreferrer">
          https://medium/link/to...
        </a>
      </p>
      <p style={{ marginTop: '2em' }}>
        The amount will be distributed to{' '}
        <AccountLink address={address} truncate underline />
      </p>
      {minterAmount && (
        <p>
          <span>bLuna </span>: {formatLuna(demicrofy(minterAmount))}
        </p>
      )}
      {burnAmount && (
        <p>
          <span>Luna </span>: {formatLuna(demicrofy(burnAmount))}
        </p>
      )}
    </article>
  );
}

export const Announcement = styled(AnnouncementBase)`
  font-size: 1em;

  word-break: keep-all;
  white-space: nowrap;

  figure {
    text-align: center;

    svg {
      font-size: 5em;
    }
  }

  h2 {
    font-size: 1.2em;
  }

  p {
    line-height: 1.8em;

    span {
      display: inline-block;
      width: 3.5em;
    }
  }
`;
