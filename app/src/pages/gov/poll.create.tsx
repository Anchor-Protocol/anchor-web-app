import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { HorizontalRuler } from '@libs/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { ChevronRight, Forum } from '@material-ui/icons';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { links } from 'env';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface PollCreateProps {
  className?: string;
}

function PollCreateBase({ className }: PollCreateProps) {
  return (
    <CenteredLayout className={className}>
      <Section>
        <h1>Choose a proposal</h1>

        <ul>
          <PollLink
            to={`/poll/create/modify-anc-distribution`}
            title="Modify ANC Distribution"
            description="Modify the ANC distribution parameters"
          />

          <PollLink
            to={`/poll/create/modify-borrow-interest`}
            title="Modify Borrow Interest"
            description="Modify the interest model parameters "
          />

          <PollLink
            to={`/poll/create/modify-collateral-attribute`}
            title="Modify Collateral Attribute"
            description="Modify the collateral attributes of an existing bAsset"
          />

          <PollLink
            to={`/poll/create/modify-market-parameters`}
            title="Modify Market Parameters"
            description="Modify the market parameters"
          />

          <PollLink
            to={`/poll/create/spend-community-pool`}
            title="Spend Community Pool"
            description="Submit community pool spending poll"
          />

          <PollLink
            to={`/poll/create/register-collateral-attributes`}
            title="Register Collateral Attributes"
            description="Register a bAsset as collateral"
          />

          <PollLink
            to={`/poll/create/text-proposal`}
            title="Text Proposal"
            description="Upload a text poll"
          />
        </ul>

        <BorderButton
          className="forum"
          component="a"
          href={links.forum}
          target="_blank"
          rel="noreferrer"
        >
          <IconSpan>
            <Forum /> Forum discussion is recommended before poll creation
          </IconSpan>
        </BorderButton>
      </Section>
    </CenteredLayout>
  );
}

function PollLink({
  to,
  title,
  description,
}: {
  to: string;
  title: ReactNode;
  description: ReactNode;
}) {
  return (
    <li>
      <Link to={to}>
        <HorizontalRuler />
        <div>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <ChevronRight />
        </div>
      </Link>
    </li>
  );
}

export const PollCreate = styled(PollCreateBase)`
  h1 {
    text-align: center;
    font-size: 27px;
    font-weight: 500;

    margin-bottom: 60px;
  }

  ul {
    list-style: none;
    padding: 0;

    a {
      display: block;
      text-decoration: none;

      &:hover {
        background-color: ${({ theme }) => theme.hoverBackgroundColor};
      }

      > div {
        padding: 24px 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h3 {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 5px;
        color: ${({ theme }) => theme.textColor};
      }

      p {
        font-size: 13px;
        color: ${({ theme }) => theme.dimTextColor};
      }

      svg {
        color: ${({ theme }) => theme.dimTextColor};
      }
    }
  }

  .forum {
    margin-top: 60px;

    width: 100%;
    min-height: 54px;
    height: auto;
    font-size: 16px;
    border-radius: 27px;

    padding: 10px;

    span {
      word-break: break-word;
      white-space: break-spaces;
    }

    svg {
      transform: scale(1.2) translateY(0.1em);
      margin-right: 10px;
    }
  }
`;
