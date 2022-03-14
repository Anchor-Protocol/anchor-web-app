import { ClickAwayListener } from '@material-ui/core';
import { useNotification } from 'contexts/notification';
import { useAccount } from 'contexts/account';
import { useJobs } from 'jobs/Jobs';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as NotificationOff } from '../assets/NotificationOff.svg';
import { ReactComponent as NotificationOn } from '../assets/NotificationOn.svg';
import { NotificationContent } from '../notifications/NotificationContent';
import { DropdownBox, DropdownContainer } from './DropdownContainer';

export interface DesktopNotificationProps {
  className?: string;
}

function DesktopNotificationBase({ className }: DesktopNotificationProps) {
  const { terraWalletAddress } = useAccount();
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
    return terraWalletAddress && permission === 'granted';
  }, [permission, terraWalletAddress]);

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
        color: ${({ theme }) => theme.header.textColor};
      }
    }
  }

  .notification-dropdown-box {
    min-width: 320px;
    padding: 28px;
  }
`;
