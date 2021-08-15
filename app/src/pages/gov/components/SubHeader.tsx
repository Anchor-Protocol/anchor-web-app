import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface SubHeaderProps {
  className?: string;
  children: ReactNode;
  breakPoints?: number;
}

function SubHeaderBase({ className, children }: SubHeaderProps) {
  return <header className={className}>{children}</header>;
}

const breakStyle = (breakPoints: number) => css`
  @media (max-width: ${breakPoints}px) {
    flex-direction: column;
    align-items: flex-start;

    > div {
      width: 100%;
      justify-content: flex-start;

      div:empty {
        flex: 1;
      }

      button,
      a {
        &:first-child {
          margin-left: 0;
        }
      }
    }

    > .buttons {
      margin-top: 15px;

      button,
      a {
        flex: 1;
      }
    }
  }
`;

export const SubHeader = styled(SubHeaderBase)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 80px 0 30px 0;

  > div {
    display: flex;
    align-items: center;

    h2 {
      font-size: 18px;
      font-weight: 700;
    }

    select {
      height: 40px;
    }

    button,
    a {
      width: 180px;
      height: 48px;
      border-radius: 26px;

      margin-left: 10px;
    }
  }

  ${({ breakPoints = false }) =>
    typeof breakPoints === 'number' && breakStyle(breakPoints)};
`;
