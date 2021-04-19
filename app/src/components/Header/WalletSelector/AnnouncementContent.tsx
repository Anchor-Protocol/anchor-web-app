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
      <button onClick={onClose}>x</button>
    </div>
  );
}

export const AnnouncementContent = styled(AnnouncementContentBase)`
  position: relative;

  > button {
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;
