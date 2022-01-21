import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UIElementProps } from 'components/layouts/UIElementProps';
import errorImage from '../assets/error.svg';

interface VestingClaimNotificationProps extends UIElementProps {
  isMobileLayout?: boolean;
  onClose: (ignored: boolean) => void;
}

function VestingClaimNotificationBase(props: VestingClaimNotificationProps) {
  const { className, isMobileLayout = false, onClose } = props;
  const [ignore, setIgnore] = useState(false);
  return (
    <div
      className={className}
      data-layout={isMobileLayout ? 'mobile' : 'modal'}
    >
      <div>
        <img src={errorImage} alt="Error" />
      </div>
      <div>
        <h2>Claim ANC</h2>
        <p>
          This account has been affected by the oracle feeder issue on Dec. 9th
          and is eligible for reimbursement.
        </p>
        <div className="ignore">
          <input
            type="checkbox"
            checked={ignore}
            onChange={() => setIgnore((value) => !value)}
          />
          <span className="label">Don't show for 24 hours</span>
        </div>
        <FlatButton component={Link} to="/anc/vesting/claim">
          Claim ANC
        </FlatButton>
        <IconButton
          className="close"
          size="small"
          onClick={() => onClose(ignore)}
        >
          <Close />
        </IconButton>
      </div>
    </div>
  );
}

export const VestingClaimNotification = styled(VestingClaimNotificationBase)`
  margin: 30px;
  text-align: center;

  position: relative;

  h2 {
    margin-top: 13px;

    font-size: 16px;
    font-weight: 700;
  }

  p {
    margin-top: 20px;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: ${({ theme }) => theme.textColor};
  }

  .ignore {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0 20px 0;
    input {
      margin-right: 8px;
    }
    span {
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: 19px;
      text-align: left;
    }
  }

  a {
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
