import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BAssetClaimProps {
  className?: string;
}

function Component({ className }: BAssetClaimProps) {
  return <div className={className}>BAssetClaim</div>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BAssetClaim = fixHMR(StyledComponent);
