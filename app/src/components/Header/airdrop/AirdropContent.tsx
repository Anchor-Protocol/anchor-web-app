import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AirdropImage } from './AirdropImage';

function AirdropBase({
  className,
  onClose,
  isMobileLayout,
}: {
  className?: string;
  onClose: () => void;
  isMobileLayout: boolean;
}) {
  return (
    <div
      className={className}
      data-layout={isMobileLayout ? 'mobile' : 'modal'}
    >
      <div>
        <AirdropImage />
      </div>
      <div>
        <h2>Airdrop</h2>
        <p>Claim your ANC tokens</p>
        <FlatButton component={Link} to="/airdrop">
          Claim
        </FlatButton>
        <IconButton className="close" size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </div>
    </div>
  );
}

export const AirdropContent = styled(AirdropBase)`
  margin: 30px;
  text-align: center;

  position: relative;

  h2 {
    margin-top: 13px;

    font-size: 16px;
    font-weight: 700;
  }

  p {
    margin-top: 5px;

    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
  }

  a {
    margin-top: 15px;

    width: 100%;
    height: 28px;

    background-color: ${({ theme }) => theme.colors.positive};
  }

  .close {
    position: absolute;
    right: -20px;
    top: -20px;

    svg {
      font-size: 16px;
    }
  }

  &[data-layout='mobile'] {
    height: 129px;
    margin: 0;
    padding: 0 20px;

    display: flex;
    align-items: center;

    background-color: ${({ theme }) =>
      theme.palette.type === 'dark' ? '#363c5f' : '#ededed'};

    img {
      width: 70px;
    }

    > :first-child {
      width: 100px;
    }

    > :last-child {
      flex: 1;

      padding-left: 5px;
      text-align: left;

      a {
        margin-top: 8px;
      }

      .close {
        right: 20px;
        top: 20px;
      }
    }
  }
`;
