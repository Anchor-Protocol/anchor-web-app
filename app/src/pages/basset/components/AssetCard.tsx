import { flat } from '@libs/styled-neumorphism';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface AssetCardProps {
  className?: string;
  children: ReactNode;
  to: string;

  title: ReactNode;
  originAssetIcon: ReactNode;
  bAssetIcon: ReactNode;
}

function Component({
  className,
  children,
  to,
  title,
  originAssetIcon,
  bAssetIcon,
}: AssetCardProps) {
  return (
    <li className={className}>
      <Link to={to}>
        <h3>
          <i>
            {originAssetIcon}
            {bAssetIcon}
          </i>
          <p>{title}</p>
        </h3>

        <div>{children}</div>
      </Link>
    </li>
  );
}

const StyledComponent = styled(Component)`
  border-radius: 20px;

  ${({ theme }) =>
    flat({
      color: theme.sectionBackgroundColor,
      backgroundColor: theme.sectionBackgroundColor,
      distance: 1,
      intensity: theme.intensity,
    })};

  padding: 60px 40px;

  a {
    text-decoration: none;

    color: ${({ theme }) => theme.textColor};

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h3 {
    i {
      display: inline-block;

      font-size: 55px;

      > :first-child {
        opacity: 0.5;
        transform: translate(-0.2em, 0);
      }

      > :last-child {
        transform: translate(-0.4em, 0) scale(1.55);
      }
    }

    p {
      margin-top: 15px;

      font-size: 18px;
      font-weight: 500;
      line-height: 1.2;
      letter-spacing: -0.3px;
    }
  }

  div {
    font-size: 13px;
    font-weight: normal;
    line-height: 1.2;
    letter-spacing: -0.3px;

    table {
      width: 100%;

      line-height: 22px;

      th {
        font-weight: normal;
        color: ${({ theme }) => theme.dimTextColor};
      }

      td {
        text-align: right;
      }
    }
  }

  transition: box-shadow 0.2s ease-out, transform 0.1s ease-in;

  &:hover {
    box-shadow: 2px 2px 31px 5px rgba(0, 0, 0, 0.11);
    transform: translateY(-0.1em);
  }
`;

export const AssetCard = fixHMR(StyledComponent);
