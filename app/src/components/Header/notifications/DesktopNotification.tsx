import { ClickAwayListener } from '@material-ui/core';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { useNotification } from 'contexts/notification';
import { useJobs } from 'jobs/Jobs';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as NotificationOff } from '../assets/NotificationOff.svg';
import { ReactComponent as NotificationOn } from '../assets/NotificationOn.svg';
import {
  DropdownBox,
  DropdownContainer,
} from '../WalletSelector/DropdownContainer';
import { NotificationContent } from './NotificationContent';

export interface DesktopNotificationProps {
  className?: string;
}

function DesktopNotificationBase({ className }: DesktopNotificationProps) {
  const { status } = useWallet();
  const { permission } = useNotification();
  const { liquidationAlert } = useJobs();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setOpenDropdown((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpenDropdown(false);
  }, []);

  const visible = useMemo(() => {
    return status === WalletStatus.WALLET_CONNECTED && permission === 'granted';
  }, [permission, status]);

  return visible ? (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={className} data-enabled={liquidationAlert.enabled}>
        <div onClick={toggleOpen} className="notification-icon">
          {liquidationAlert.enabled ? <NotificationOn /> : <NotificationOff />}
        </div>

        {openDropdown && (
          <DropdownContainer>
            <DropdownBox className="notification-dropdown-box">
              <NotificationContent />
            </DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  ) : null;
}

export const DesktopNotification = styled(DesktopNotificationBase)`
  display: inline-block;
  position: relative;

  .notification-icon {
    svg {
      width: 43px;
      height: 27px;

      transform: translateY(-2px);

      cursor: pointer;

      color: #666666;

      &:hover {
        color: #999999;
      }
    }
  }

  &[data-enabled='true'] {
    .notification-icon {
      svg {
        color: ${({ theme }) => theme.colors.positive};
      }
    }
  }

  .notification-dropdown-box {
    padding: 28px;
  }
`;
