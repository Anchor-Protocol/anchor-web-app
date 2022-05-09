import styled from 'styled-components';
import React from 'react';
import { AuroraGradient } from './AuroraGradient';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { Chain } from '@anchor-protocol/types';

export const HeaderBackgroundGradient = () => {
  const {
    target: { chain },
  } = useDeploymentTarget();

  if (chain !== Chain.Aurora) {
    return null;
  }

  return (
    <Container>
      <AuroraGradient />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;
