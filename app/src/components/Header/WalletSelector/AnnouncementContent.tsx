import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface AnnouncementContentProps {
  className?: string;
  children: ReactNode;
  onClose: () => void;
}

function AnnouncementContentBase({
  className,
  children,
  onClose,
}: AnnouncementContentProps) {
  return (
    <div className={className}>
      <div>{children}</div>
      <IconButton className="close" size="small" onClick={onClose}>
        <Close />
      </IconButton>
    </div>
  );
}

export const AnnouncementContent = styled(AnnouncementContentBase)`
  position: relative;

  padding: 25px 20px;
  font-size: 13px;

  > button {
    position: absolute;
    right: 10px;
    top: 10px;

    svg {
      font-size: 16px;
    }
  }
`;
