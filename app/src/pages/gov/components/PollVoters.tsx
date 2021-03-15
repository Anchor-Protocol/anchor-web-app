import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalScrollTable } from '@terra-dev/neumorphism-ui/components/HorizontalScrollTable';
import {
  demicrofy,
  formatANCWithPostfixUnits,
} from '@anchor-protocol/notation';
import { AccountLink } from 'components/AccountLink';
import { useVoters } from 'pages/gov/queries/voters';
import styled from 'styled-components';

export interface PollVotersProps {
  className?: string;
  pollId: number;
}

function PollVotersBase({ className, pollId }: PollVotersProps) {
  const [voters, isLast, loadMore] = useVoters(pollId);

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
