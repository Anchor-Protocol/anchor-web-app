import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface WhExportProps {
  className?: string;
}

function Component({ className }: WhExportProps) {
  return <div className={className}>WhExport</div>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const WhExport = fixHMR(StyledComponent);
