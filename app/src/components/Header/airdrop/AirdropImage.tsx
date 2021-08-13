import React from 'react';
import styled, { keyframes } from 'styled-components';
import airdropImage from '../assets/airdrop.svg';

export interface AirdropImageProps {
  className?: string;
}

function AirdropImageBase({ className }: AirdropImageProps) {
  return <img src={airdropImage} className={className} alt="Airdrop!" />;
}

const parachute = keyframes`
  0% {
    transform: rotate(10deg) translateY(0);
  }
  
  25% {
    transform: rotate(-10deg) translateY(-3px);
  }
  
  50% {
    transform: rotate(10deg) translateY(0);
  }
  
  75% {
    transform: rotate(-10deg) translateY(3px);
  }
  
  100% {
    transform: rotate(10deg) translateY(0);
  }
`;

export const AirdropImage = styled(AirdropImageBase)`
  animation: ${parachute} 6s ease-in-out infinite;
`;
