import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';

function CollateralListBase(props: UIElementProps) {
  const { children } = props;
  return <div>{children}</div>;
}

export const CollateralList = styled(CollateralListBase)``;
