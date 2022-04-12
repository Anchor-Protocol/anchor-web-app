import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

function GaugesBase(props: UIElementProps) {
  const { children } = props;
  return <div>{children}</div>;
}

export const Gauges = styled(GaugesBase)``;
