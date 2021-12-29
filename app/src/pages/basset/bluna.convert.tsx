import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BlunaConvertProps {
  className?: string;
}

function Component({ className }: BlunaConvertProps) {
  return <div className={className}>BlunaConvert</div>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BlunaConvert = fixHMR(StyledComponent);
