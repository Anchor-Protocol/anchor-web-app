import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface WormholeConvertProps {
  className?: string;
}

function Component({ className }: WormholeConvertProps) {
  return <div className={className}>WormholeConvert</div>;
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const WormholeConvert = fixHMR(StyledComponent);
