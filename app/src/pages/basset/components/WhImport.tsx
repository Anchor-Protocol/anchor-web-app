import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface WhImportProps {
  className?: string;
}

function Component({ className }: WhImportProps) {
  return <div className={className}>WhImport</div>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const WhImport = fixHMR(StyledComponent);
