import React from 'react';
import styled from 'styled-components';

export interface BoxProps {
  className?: string;
}

function BoxBase({ className }: BoxProps) {
  return <div className={className}>...</div>;
}

export const Box = styled(BoxBase)`
  // TODO
`;