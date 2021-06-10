import styled from 'styled-components';
import React from 'react';

export interface MobileNotificationProps {
  className?: string;
}

function MobileNotificationBase({ className }: MobileNotificationProps) {
  return <div className={className}>MobileNotification</div>;
}

export const MobileNotification = styled(MobileNotificationBase)`
  // TODO
`;
