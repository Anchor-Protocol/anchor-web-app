import { formatANCWithPostfixUnits } from '@anchor-protocol/notation';
import { anchorToken } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@libs/neumorphism-ui/components/HorizontalScrollTable';
import { AccountLink } from 'components/links/AccountLink';
import React from 'react';
import styled from 'styled-components';

export interface PollVotersProps {
  className?: string;
  voters: anchorToken.gov.Voter[];
  isLast: boolean;
  loadMore: () => void;
}

function PollVotersBase({
  className,
  voters,
  isLast,
  loadMore,
}: PollVotersProps) {
  return (
    <div className={className}>
      <HorizontalScrollTable minWidth={800} startPadding={20} endPadding={20}>
        <colgroup>
          <col style={{ width: 600 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 200 }} />
        </colgroup>
        <thead>
          <tr>
            <th>Voter</th>
            <th style={{ textAlign: 'center' }}>Vote</th>
            <th style={{ textAlign: 'right' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {voters.map(({ vote, balance, voter }) => (
            <tr key={voter}>
              <td>
                <AccountLink address={voter} />
              </td>
              <td style={{ textAlign: 'center' }}>
                {vote === 'yes' ? 'Yes' : 'No'}
              </td>
              <td style={{ textAlign: 'right' }}>
                {formatANCWithPostfixUnits(demicrofy(balance))} ANC
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>

      {!isLast && (
        <BorderButton className="more" onClick={loadMore}>
          More
        </BorderButton>
      )}
    </div>
  );
}

export const PollVoters = styled(PollVotersBase)`
  .more {
    width: 100%;
    margin-top: 20px;
  }
`;
