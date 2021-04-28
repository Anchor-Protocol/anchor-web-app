import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatRate,
} from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import { Schedule } from '@material-ui/icons';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalRuler } from '@terra-dev/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import { TimeEnd } from '@terra-dev/use-time-end';
import { useLastSyncedHeight } from 'base/queries/lastSyncedHeight';
import { AccountLink } from 'components/AccountLink';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { useCodeViewerDialog } from 'components/useCodeViewerDialog';
import {
  Description,
  DescriptionGrid,
} from 'pages/gov/components/DescriptionGrid';
import { pollStatusLabels } from 'pages/gov/components/formatPollStatus';
import { PollMsgRenderer } from 'pages/gov/components/PollMsgRenderer';
import { PollGraph } from 'pages/gov/components/Polls/PollGraph';
import { PollStatusSpan } from 'pages/gov/components/PollStatusSpan';
import { PollVoters } from 'pages/gov/components/PollVoters';
import { usePollVoteDialog } from 'pages/gov/components/usePollVoteDialog';
import { extractPollDetail } from 'pages/gov/logics/extractPollDetail';
import { isLinkHttp } from 'pages/gov/logics/isLinkHttp';
import { useCanIVote } from 'pages/gov/queries/canIVote';
import { usePoll } from 'pages/gov/queries/poll';
import { useTotalStaked } from 'pages/gov/queries/totalStaked';
import { useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

export interface PollDetailProps extends RouteComponentProps<{ id: string }> {
  className?: string;
}

function PollDetailBase({ className, match }: PollDetailProps) {
  const {
    data: { poll },
  } = usePoll(+match.params.id);

  const {
    data: { govANCBalance, govState, govConfig },
  } = useTotalStaked();

  const canIVote = useCanIVote(poll?.id);

  const [openVoteDialog, voteDialogElement] = usePollVoteDialog();

  const { data: lastSyncedHeight } = useLastSyncedHeight();

  const [openCodeViewer, codeViewerElement] = useCodeViewerDialog();

  const pollDetail = useMemo(() => {
    return poll && govANCBalance && govState && govConfig && lastSyncedHeight
      ? extractPollDetail(
          poll,
          govANCBalance,
          govState,
          govConfig,
          lastSyncedHeight,
        )
      : undefined;
  }, [govANCBalance, govConfig, govState, lastSyncedHeight, poll]);

  if (!pollDetail) {
    return null;
  }

  return (
    <PaddedLayout className={className}>
      <Section className="content">
        <div className="content-id">
          <span>ID: {pollDetail.poll.id}</span>
          <span>{pollDetail.type}</span>
        </div>

        <div className="content-title">
          <div>
            <p>
              <PollStatusSpan
                status={pollDetail.poll.status}
                endsIn={pollDetail.endsIn}
              >
                {pollStatusLabels[pollDetail.poll.status]}
              </PollStatusSpan>
            </p>
            <h2>{pollDetail.poll.title}</h2>
          </div>
          <ActionButton
            disabled={
              !canIVote ||
              !poll ||
              !lastSyncedHeight ||
              poll.status !== 'in_progress' ||
              poll.end_height < lastSyncedHeight
            }
            onClick={() => openVoteDialog({ pollId: +match.params.id })}
          >
            Vote
          </ActionButton>
        </div>

        <HorizontalHeavyRuler />

        <DescriptionGrid className="content-detail">
          <article>
            <h4>Creator</h4>
            <p>
              <AccountLink address={pollDetail.poll.creator} />
            </p>
          </article>

          <article>
            <h4>Amount</h4>
            <p>
              {formatANCWithPostfixUnits(
                demicrofy(pollDetail.poll.deposit_amount),
              )}{' '}
              ANC
            </p>
          </article>

          <article>
            <h4>End Time</h4>
            <p>
              <IconSpan>
                {pollDetail.endsIn.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                {', '}
                {pollDetail.endsIn.toLocaleTimeString(
                  'en-US',
                )} <Schedule /> <TimeEnd endTime={pollDetail.endsIn} />
              </IconSpan>
            </p>
          </article>

          <article>
            <h4>Link</h4>
            <p>
              {isLinkHttp(pollDetail.poll.link) ? (
                <a href={pollDetail.poll.link} target="_blank" rel="noreferrer">
                  {pollDetail.poll.link}
                </a>
              ) : (
                '-'
              )}
            </p>
          </article>
        </DescriptionGrid>

        <Description>
          <article>
            <h4>Description</h4>
            <p>{pollDetail.poll.description}</p>
          </article>
        </Description>

        {Array.isArray(pollDetail.msgs) &&
          pollDetail.msgs.filter((msg) => !!msg).length > 0 && (
            <>
              <HorizontalRuler style={{ margin: '40px 0' }} />

              <DescriptionGrid>
                {pollDetail.msgs.map((msg, i) => (
                  <PollMsgRenderer key={'msg' + i} msg={msg} />
                ))}
              </DescriptionGrid>

              <BorderButton
                style={{
                  marginTop: 40,
                  width: '100%',
                  height: 30,
                  opacity: 0.3,
                }}
                onClick={() =>
                  openCodeViewer({
                    title: 'Raw Msgs',
                    source: JSON.stringify(pollDetail.msgs, null, 2),
                  })
                }
              >
                See Raw Msgs
              </BorderButton>
            </>
          )}
      </Section>

      <Section className="detail">
        <h2>VOTE DETAILS</h2>

        <PollGraph
          total={pollDetail.vote.total}
          yes={pollDetail.vote.yes}
          no={pollDetail.vote.no}
          baseline={pollDetail.baseline.value}
          baselineLabel={pollDetail.baseline.label}
          displaySpans={false}
        />

        <section className="detail-voted">
          <article>
            <h4>VOTED</h4>
            <p>
              {formatRate(
                ((pollDetail.vote.yes + pollDetail.vote.no) /
                  pollDetail.vote.total) as Rate<number>,
              )}
              %
            </p>
            <span>Quorum {govConfig ? formatRate(govConfig.quorum) : 0}%</span>
          </article>

          <article data-vote="yes">
            <h4>YES</h4>
            <p>
              {formatRate(
                (pollDetail.vote.yes / pollDetail.vote.total) as Rate<number>,
              )}
              %
            </p>
            <span>
              {poll ? formatANCWithPostfixUnits(demicrofy(poll.yes_votes)) : 0}{' '}
              ANC
            </span>
          </article>

          <article data-vote="no">
            <h4>NO</h4>
            <p>
              {formatRate(
                (pollDetail.vote.no / pollDetail.vote.total) as Rate<number>,
              )}
              %
            </p>
            <span>
              {poll ? formatANCWithPostfixUnits(demicrofy(poll.no_votes)) : 0}{' '}
              ANC
            </span>
          </article>
        </section>

        {poll &&
          typeof lastSyncedHeight === 'number' &&
          poll.status === 'in_progress' &&
          poll.end_height > lastSyncedHeight && <PollVoters pollId={poll.id} />}
      </Section>

      {voteDialogElement}
      {codeViewerElement}
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

      .MuiButtonBase-root {
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
          color: ${({ theme }) => theme.colors.positive};
        }

        &[data-vote='no'] {
          color: ${({ theme }) => theme.colors.negative};
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
