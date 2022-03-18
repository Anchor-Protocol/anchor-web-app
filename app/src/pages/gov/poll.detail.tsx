import { formatANCWithPostfixUnits } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import {
  useAncBalanceQuery,
  useAnchorWebapp,
  useDeploymentTarget,
  useGovPollQuery,
  useGovStateQuery,
  useGovVoteAvailableQuery,
  useGovVotersQuery,
  useLastSyncedHeightQuery,
} from '@anchor-protocol/app-provider';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalHeavyRuler } from '@libs/neumorphism-ui/components/HorizontalHeavyRuler';
import { HorizontalRuler } from '@libs/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { rulerLightColor, rulerShadowColor } from '@libs/styled-neumorphism';
import { TimeEnd } from '@libs/use-time-end';
import { Schedule } from '@material-ui/icons';
import { useCodeViewerDialog } from 'components/dialogs/useCodeViewerDialog';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { AccountLink } from 'components/links/AccountLink';
import { screen } from 'env';
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
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { UIElementProps } from '@libs/ui';

function PollDetailBase({ className }: UIElementProps) {
  const {
    target: { isNative },
  } = useDeploymentTarget();

  const { contractAddress } = useAnchorWebapp();

  const { id = '0' } = useParams();

  const { data: { poll } = {} } = useGovPollQuery(+id);

  if (poll?.id === 11) {
    poll.link =
      'https://forum.anchorprotocol.com/t/proposal-redirect-remaining-anc-lp-incentives-anc-buybacks-to-astroport/1971';
  }

  const { data: { ancBalance: govANCBalance } = {} } = useAncBalanceQuery(
    contractAddress.anchorToken.gov,
  );
  const { data: { govState, govConfig } = {} } = useGovStateQuery();

  const canIVote = useGovVoteAvailableQuery(poll?.id);

  const [openVoteDialog, voteDialogElement] = usePollVoteDialog();

  const { data: lastSyncedHeight = 0 } = useLastSyncedHeightQuery();

  const { voters, isLast, loadMore } = useGovVotersQuery(poll?.id);

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
          {isNative && (
            <ActionButton
              disabled={
                !canIVote ||
                !poll ||
                !lastSyncedHeight ||
                poll.status !== 'in_progress' ||
                poll.end_height < lastSyncedHeight
              }
              onClick={() => openVoteDialog({ pollId: +id })}
            >
              Vote
            </ActionButton>
          )}
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

        {!!poll &&
          poll.status === 'in_progress' &&
          poll.end_height > lastSyncedHeight && (
            <PollVoters voters={voters} isLast={isLast} loadMore={loadMore} />
          )}
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

          word-break: break-word;
          white-space: break-spaces;
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
                color: theme.sectionBackgroundColor,
              })};
        }

        &:not(:last-child) {
          border-right: 1px solid
            ${({ theme }) =>
              rulerShadowColor({
                intensity: theme.intensity,
                color: theme.sectionBackgroundColor,
              })};
        }
      }

      margin-bottom: 76px;
    }
  }

  @media (max-width: 650px) {
    .detail {
      .detail-voted {
        margin-top: 20px;

        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, auto);

        article {
          padding: 20px 0;

          p {
            font-size: 30px;
          }

          &:not(:first-child) {
            border-left: 0;
            border-top: 1px solid
              ${({ theme }) =>
                rulerLightColor({
                  intensity: theme.intensity,
                  color: theme.sectionBackgroundColor,
                })};
          }

          &:not(:last-child) {
            border-right: 0;
            border-bottom: 1px solid
              ${({ theme }) =>
                rulerShadowColor({
                  intensity: theme.intensity,
                  color: theme.sectionBackgroundColor,
                })};
          }
        }

        margin-bottom: 20px;
      }
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    .content {
      .content-title {
        flex-direction: column;
        align-items: flex-start;

        .MuiButtonBase-root {
          margin-top: 16px;
          width: 100%;
        }
      }
    }
  }
`;
