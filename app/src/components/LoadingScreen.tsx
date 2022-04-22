import styled from 'styled-components';
import React from 'react';
import { SwishSpinner } from 'react-spinners-kit';

interface LoadingScreenProps {
  text?: string;
}

export const LoadingScreen = ({ text }: LoadingScreenProps) => (
  <Container>
    <SwishSpinner />
    {text && <p>{text}</p>}
  </Container>
);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;
