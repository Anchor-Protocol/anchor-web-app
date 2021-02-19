import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@anchor-protocol/styled-neumorphism';
import { HOUR, TimeEnd } from '@anchor-protocol/use-time-end';
import { Schedule } from '@material-ui/icons';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { DescriptionGrid } from 'pages/gov/components/DescriptionGrid';
import { PollGraph } from 'pages/gov/components/Polls/PollGraph';
import { useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

export interface PollDetailProps extends RouteComponentProps<{ id: string }> {
  className?: string;
}

function PollDetailBase({ className, match }: PollDetailProps) {
  const endsIn = useMemo(() => new Date(Date.now() + HOUR * 10), []);

  return (
    <PaddedLayout className={className}>
      <Section className="content">
        <div className="content-id">
          <span>ID: {match.params.id}</span>
          <span>Community Spend</span>
        </div>

        <div className="content-title">
          <div>
            <p>IN PROGRESS</p>
            <h2>Meme Contest</h2>
          </div>
          <ActionButton>Vote</ActionButton>
        </div>

        <HorizontalHeavyRuler />

        <DescriptionGrid className="content-detail">
          <article>
            <h4>Creator</h4>
            <p>terra1c27yxz0y2vks5w5uq0uqrtek4lgt773y7x5jng</p>
          </article>

          <article>
            <h4>End Time</h4>
            <p>
              <IconSpan>
                {endsIn.toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                {endsIn.toLocaleTimeString()} <Schedule />{' '}
                <TimeEnd endTime={endsIn} />
              </IconSpan>
            </p>
          </article>

          <article>
            <h4>Description</h4>
            <p>
              To increase the exposure and awareness of Anchor Protocol, a meme
              contest will be held. Option 2 (please refer to mirror forum) will
              be used to select winners. Target of submissions: 100-120
            </p>
          </article>

          <article>
            <h4>Link</h4>
            <p>
              <a
                href="https://forum.anchorprotocol.com/t/anchor-protocols-meme-contest/93"
                target="_blank"
                rel="noreferrer"
              >
                https://forum.anchorprotocol.com/t/anchor-protocols-meme-contest/93
              </a>
            </p>
          </article>

          <article>
            <h4>Recipient</h4>
            <p>terra1cwk4s0jtvt69mawaqsay2a9h20cgqd9h5c2qgk</p>
          </article>

          <article>
            <h4>Amount</h4>
            <p>2,500 ANC</p>
          </article>
        </DescriptionGrid>
      </Section>

      <Section className="detail">
        <h2>VOTE DETAILS</h2>

        <PollGraph
          total={100}
          yes={45}
          no={5}
          baseline={35}
          displaySpans={false}
        />

        <section className="detail-voted">
          <article>
            <h4>VOTED</h4>
            <p>11%</p>
            <span>Quorum 10%</span>
          </article>

          <article data-vote="yes">
            <h4>YES</h4>
            <p>90%</p>
            <span>3.06 ANC</span>
          </article>

          <article data-vote="no">
            <h4>NO</h4>
            <p>10%</p>
            <span>1,038 ANC</span>
          </article>
        </section>

        <HorizontalScrollTable
          minWidth={1200}
          startPadding={20}
          endPadding={20}
        >
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
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={'voter' + i}>
                <td>terra1s4acnl09edwnn8kcd5wc407qzde35gpdc6c9e8</td>
                <td style={{ textAlign: 'center' }}>
                  {Math.random() > 0.5 ? 'Yes' : 'No'}
                </td>
                <td style={{ textAlign: 'right' }}>8.032 ANC</td>
              </tr>
            ))}
          </tbody>
        </HorizontalScrollTable>
      </Section>
    </PaddedLayout>
  );
}

export const PollDetail = styled(PollDetailBase)`
  .content {
    .content-id {
      font-size: 13px;
      color: ${({ theme }) => theme.dimTextColor};

      > :first-child {
        margin-right: 40px;
      }

      margin-bottom: 30px;
    }

    .content-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > :first-child {
        p {
          font-size: 13px;
        }

        h2 {
          margin-top: 8px;

          font-size: 24px;
          font-weight: 500;
        }
      }

      button {
        width: 144px;
      }

      margin-bottom: 40px;
    }

    .content-detail {
      margin-top: 40px;
    }
  }

  .detail {
    h2 {
      font-size: 13px;
      font-weight: 500;

      margin-bottom: 66px;
    }

    .detail-voted {
      margin-top: 62px;

      display: grid;
      grid-template-columns: repeat(3, 1fr);

      article {
        text-align: center;

        &[data-vote='yes'] {
          color: #15cc93;
        }

        &[data-vote='no'] {
          color: #e95979;
        }

        h4 {
          font-size: 14px;
          font-weight: 700;

          margin-bottom: 5px;
        }

        p {
          font-size: 40px;
          font-weight: 300;

          margin-bottom: 5px;
        }

        span {
          font-size: 13px;
          color: ${({ theme }) => theme.dimTextColor};
        }

        &:not(:first-child) {
          border-left: 1px solid
            ${({ theme }) =>
              rulerLightColor({
                intensity: theme.intensity,
                color: theme.backgroundColor,
              })};
        }

        &:not(:last-child) {
          border-right: 1px solid
            ${({ theme }) =>
              rulerShadowColor({
                intensity: theme.intensity,
                color: theme.backgroundColor,
              })};
        }
      }

      margin-bottom: 76px;
    }
  }
`;
