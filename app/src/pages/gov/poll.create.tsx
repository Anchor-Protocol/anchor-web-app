import { BorderButton } from '@anchor-protocol/neumorphism-ui/components/BorderButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { ChevronRight, Forum } from '@material-ui/icons';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { govPathname } from 'pages/gov/env';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
            to={`/${govPathname}/poll/create/text-proposal`}
            title="Modify Governance Parameters"
            description="Modify the existing governance parameters of ..."
          />

          <PollLink
            to={`/${govPathname}/poll/create/text-proposal`}
            title="Spend Community Pool"
            description="Submit community pool spending proposal"
          />

          <PollLink
            to={`/${govPathname}/poll/create/text-proposal`}
            title="Submit Text Proposal"
            description="Upload a text proposal"
          />
        </ul>

        <BorderButton className="forum">
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
    height: 54px;
    font-size: 16px;
    border-radius: 27px;

    svg {
      transform: scale(1.2) translateY(0.1em);
      margin-right: 10px;
    }
  }
`;
