import { Launch } from '@material-ui/icons';
import { screen } from 'env';
import { fixHMR } from 'fix-hmr';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface PageTitleProps {
  className?: string;
  title: ReactNode;
  tooltip?: string;
  docs?: string;
}

function PageTitleBase({ className, title, tooltip, docs }: PageTitleProps) {
  return (
    <h1 className={className}>
      <IconSpan>
        {title}
        {tooltip && (
          <>
            {' '}
            <InfoTooltip>{tooltip}</InfoTooltip>
          </>
        )}
      </IconSpan>
      {docs && (
        <a href={docs} target="anchor-docs" rel="noreferrer">
          Docs
          <Launch />
        </a>
      )}
    </h1>
  );
}

export const StyledPageTitle = styled(PageTitleBase)`
  font-size: 44px;
  font-weight: 900;

  a {
    margin-left: 1.1em;

    text-decoration: none;
    font-size: 14px;
    color: ${({ theme }) => theme.dimTextColor};
    font-weight: 500;

    svg {
      font-size: 1em;
      transform: translate(0.2em, 0.14em);
    }
  }

  @media (max-width: ${screen.tablet.max}px) {
    font-size: 36px;
  }

  @media (max-width: ${screen.mobile.max}px) {
    font-size: 30px;
  }
`;

export const PageTitle = fixHMR(StyledPageTitle);

export const FlexTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 25px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;

    button {
      width: 100%;
      margin-top: 1em;
    }
  }

  @media (max-width: ${screen.mobile.max}px) {
    margin-bottom: 15px;
  }
`;

export const TitleContainer = styled.div`
  margin-bottom: 25px;

  @media (max-width: ${screen.mobile.max}px) {
    margin-bottom: 15px;
  }
`;
