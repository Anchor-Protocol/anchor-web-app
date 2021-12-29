import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface AssetCardProps {
  className?: string;
  children: ReactNode;
}

function Component({ className, children }: AssetCardProps) {
  return <li className={className}>{children}</li>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const AssetCard = fixHMR(StyledComponent);
