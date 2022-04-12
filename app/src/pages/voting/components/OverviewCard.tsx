import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

function OverviewCardBase(props: UIElementProps) {
  const { children } = props;
  return <div>{children}</div>;
}

export const OverviewCard = styled(OverviewCardBase)``;
