import { MICRO, truncate } from '@anchor-protocol/notation';
import big from 'big.js';
import React from 'react';
import styled from 'styled-components';
import { AnnouncementTargetUser } from '../data/type';

export interface MintUserAnnouncementContentProps
  extends AnnouncementTargetUser {
  className?: string;
}

function MintUserAnnouncementContentBase({
  className,
  address,
  amount,
}: MintUserAnnouncementContentProps) {
  return (
    <div className={className}>
      <ul>
        <li>{truncate(address)}</li>
        <li>{big(amount).div(MICRO).toFixed()}</li>
      </ul>
    </div>
  );
}

export const MintUserAnnouncementContent = styled(
  MintUserAnnouncementContentBase,
)`
  // TODO
`;
