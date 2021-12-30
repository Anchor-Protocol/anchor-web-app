import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface AssetCardProps {
  className?: string;
  children: ReactNode;
  to: string;
}

function Component({ className, children, to }: AssetCardProps) {
  return (
    <li className={className}>
      <Link to={to}>{children}</Link>
    </li>
  );
}

const StyledComponent = styled(Component)`
  border: 1px solid black;
`;

export const AssetCard = fixHMR(StyledComponent);
