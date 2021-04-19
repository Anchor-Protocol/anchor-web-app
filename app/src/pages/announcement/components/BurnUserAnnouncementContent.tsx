import { MICRO, truncate } from '@anchor-protocol/notation';
import big from 'big.js';
import React from 'react';
import styled from 'styled-components';
import { AnnouncementTargetUser } from '../data/type';

export interface BurnUserAnnouncementContentProps
  extends AnnouncementTargetUser {
  className?: string;
}

function BurnUserAnnouncementContentBase({
  className,
  address,
  amount,
}: BurnUserAnnouncementContentProps) {
  return (
    <div className={className}>
      <ul>
        <li>{truncate(address)}</li>
        <li>{big(amount).div(MICRO).toFixed()}</li>
      </ul>
    </div>
  );
}

export const BurnUserAnnouncementContent = styled(
  BurnUserAnnouncementContentBase,
)`
  // TODO
`;
