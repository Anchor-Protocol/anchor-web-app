import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import React, { useCallback, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { UIElementProps } from 'components/layouts/UIElementProps';
import errorImage from '../assets/error.svg';
import { useAncVestingAccountQuery } from '@anchor-protocol/app-provider/queries/anc/vestingClaim';
import { Dec } from '@terra-money/terra.js';
import { DropdownContainer, DropdownBox } from '../desktop/DropdownContainer';
import { useLocalStorage } from 'usehooks-ts';

type VestingClaimNotificationReturn = [JSX.Element | undefined, () => void];

export function useVestingClaimNotification(): VestingClaimNotificationReturn {
  const { data: { vestingAccount } = {} } = useAncVestingAccountQuery();

  const matchAncVestingClaim = useMatch('/anc/vesting/claim');

  const [open, setOpen] = useState(true);
  const yesterday = new Date(new Date().getTime() - 86400000);
  const [ignoreUntil, setIgnoreUntil] = useLocalStorage(
    '__anchor_ignore_vesting_claim',
    yesterday.toISOString(),
  );

  const setIgnore = useCallback(() => {
    const timestamp = new Date(new Date().getTime() + 86400000).toISOString();
    setIgnoreUntil(timestamp);

    // this is not the best idea but saves having to split out the vesting
    // claim into a provider/context pattern and its short term anyway
    (window as any).__anchor_ignore_vesting_claim = timestamp;
  }, [setIgnoreUntil]);

  const ignore = (window as any).__anchor_ignore_vesting_claim ?? ignoreUntil;

  const showNotification =
    open &&
    !matchAncVestingClaim &&
    vestingAccount &&
    new Dec(vestingAccount.accrued_anc).gt(0) &&
    new Date(ignore) < new Date();

  return [
    showNotification ? (
      <DropdownContainer>
        <DropdownBox>
          <VestingClaimNotification
            onClose={(ignored) => {
              setOpen(false);
              if (ignored) {
                setIgnore();
              }
            }}
          />
        </DropdownBox>
      </DropdownContainer>
    ) : undefined,
    setIgnore,
  ];
}

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
        <Checkbox
          checked={ignore}
          onChange={() => setIgnore((value) => !value)}
        />
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

interface CheckboxProps extends UIElementProps {
  checked: boolean;
  onChange: () => void;
}

function CheckboxBase(props: CheckboxProps) {
  const { className, checked, onChange } = props;
  return (
    <label className={className} data-checked={checked}>
      Don't show for 24 hours
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkmark" />
    </label>
  );
}

const Checkbox = styled(CheckboxBase)`
  position: relative;
  padding-left: 32px;
  margin-bottom: 12px;
  cursor: pointer;
  -moz-user-select: none;
  -ms-user-select: none;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 0 20px 0;
  color: ${({ theme }) => theme.dimTextColor};

  &[data-checked='true'] {
    font-weight: 500;
    color: ${({ theme }) => theme.textColor};
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #e4e4e4;
    border-radius: 4px;
  }

  &:hover input ~ .checkmark {
    background-color: #ccc;
  }

  input:checked ~ .checkmark {
    background-color: ${({ theme }) => theme.colors.positive};
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    left: 8px;
    top: 4px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

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
