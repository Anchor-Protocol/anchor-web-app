import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface DescriptionGridProps {
  className?: string;
  children: ReactNode;
}

function DescriptionGridBase({ className, children }: DescriptionGridProps) {
  return <section className={className}>{children}</section>;
}

const itemStyle = css`
  article {
    h4 {
      font-size: 13px;
      font-weight: 500;
      color: ${({ theme }) => theme.dimTextColor};

      &:not(:first-child) {
        margin-top: 10px;
      }

      margin-bottom: 5px;
    }

    p {
      font-size: 14px;
      line-height: 1.5;
      max-width: 90%;
      word-break: normal;
      text-align: justify;
      white-space: break-spaces;
    }
  }
`;

export const DescriptionGrid = styled(DescriptionGridBase)`
  ${itemStyle};

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 40px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const Description = styled.section`
  ${itemStyle};

  margin-top: 40px;
`;
