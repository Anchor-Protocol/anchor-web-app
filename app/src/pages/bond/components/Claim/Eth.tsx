import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface ClaimEthProps {
  className?: string;
}

function ClaimEthBase({ className }: ClaimEthProps) {
  return <div className={className}>Eth...</div>;
}

export const StyledClaimEth = styled(ClaimEthBase)`
  .claim-receipt {
    margin-top: 2em;
  }
`;

export const ClaimEth = fixHMR(StyledClaimEth);
