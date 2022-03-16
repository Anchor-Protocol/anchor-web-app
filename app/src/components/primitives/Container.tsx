import React from 'react';
import { UIElementProps } from '@libs/ui';
import styled from 'styled-components';

export interface ContainerProps extends UIElementProps {
  direction: 'row' | 'column';
  gap?: number;
}

function ContainerBase(props: ContainerProps) {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
}

export const Container = styled(ContainerBase)`
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: ${(props) => props.gap ?? 0}px;
`;
